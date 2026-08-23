#!/usr/bin/env node
/* Playwright 的極小替身，直接用 CDP 驅動本機已安裝的 Chrome。
 *
 * 為什麼有這一支（2026-08-23，Windows 這台）：
 * `tools/og-resize.mjs`、`og-plate.mjs`、`app-icons.mjs`、`logo-png.mjs` 這幾支都要
 * 一個瀏覽器，而它們找的是**雲端 session 才有的** Playwright
 * （`/opt/node22/lib/node_modules/playwright`）。這台電腦沒有，也不想為了產圖
 * 破壞「零 npm 依賴」那條（CLAUDE.md 第三節）。
 *
 * 那幾支都是這樣找模組的：
 *     const pwPaths = [process.env.PLAYWRIGHT_MODULE, "/opt/node22/.../playwright", "playwright"]
 * 所以**只要把 PLAYWRIGHT_MODULE 指到這一支，那些腳本一個字都不用改**：
 *
 *     CHROME_PATH="C:/Program Files/Google/Chrome/Application/chrome.exe" \
 *     PLAYWRIGHT_MODULE="file:///C:/MyProjects/fangren-dental/tools/chrome-cdp.mjs" \
 *     node tools/og-plate.mjs perio ...
 *
 * ⚠ 只實作那幾支真正用到的 API：
 *     chromium.launch({executablePath}) / browser.newPage({viewport,deviceScaleFactor})
 *     page.setContent(html) / page.evaluate(fn, arg) / page.screenshot({type,quality})
 *     browser.close()
 *   不是通用的 Playwright 替代品，缺什麼再補什麼。
 *
 * ⚠⚠ CLAUDE.md 第九節第 18 條：完整版 chrome 畫出來會比 --window-size 少 87px。
 *   這一支不靠視窗大小 —— 用 `Emulation.setDeviceMetricsOverride` 指定畫面尺寸，
 *   截圖用 `Page.captureScreenshot`，並在回傳前**驗一次寬高**，對不上就 throw。
 *
 * ⚠ setContent 是寫成暫存檔再 file:// 開，不是 data: URL ——
 *   這幾支的 HTML 內嵌了字型與底圖的 base64，動輒兩三 MB，data: URL 會爆。
 */

import { spawn } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

class CDP {
  constructor(ws) { this.ws = ws; this.id = 0; this.pending = new Map(); this.handlers = new Map();
    ws.addEventListener("message", (ev) => {
      const m = JSON.parse(ev.data);
      if (m.id !== undefined) {
        const p = this.pending.get(m.id); this.pending.delete(m.id);
        if (!p) return;
        if (m.error) p.reject(new Error(`${m.error.message} (${JSON.stringify(m.error.data ?? "")})`));
        else p.resolve(m.result);
      } else {
        for (const h of this.handlers.get(m.method) ?? []) h(m.params, m.sessionId);
      }
    });
  }
  on(method, fn) { if (!this.handlers.has(method)) this.handlers.set(method, []); this.handlers.get(method).push(fn); }
  send(method, params = {}, sessionId) {
    const id = ++this.id;
    return new Promise((resolve, reject) => {
      this.pending.set(id, { resolve, reject });
      this.ws.send(JSON.stringify({ id, method, params, ...(sessionId ? { sessionId } : {}) }));
    });
  }
}

const waitFor = (ws, type) => new Promise((res, rej) => {
  ws.addEventListener(type, res, { once: true });
  ws.addEventListener("error", rej, { once: true });
});

class Page {
  constructor(cdp, sessionId, size) { this.cdp = cdp; this.sid = sessionId; this.size = size; this.tmp = []; }
  async _init() {
    await this.cdp.send("Page.enable", {}, this.sid);
    await this.cdp.send("Runtime.enable", {}, this.sid);
    await this.cdp.send("Emulation.setDeviceMetricsOverride", {
      width: this.size.width, height: this.size.height,
      deviceScaleFactor: this.size.deviceScaleFactor, mobile: false,
    }, this.sid);
  }
  async goto(url) {
    const loaded = new Promise((res) => this.cdp.on("Page.loadEventFired", (_p, sid) => { if (sid === this.sid) res(); }));
    await this.cdp.send("Page.navigate", { url }, this.sid);
    await loaded;
  }
  async setContent(html) {
    const f = path.join(os.tmpdir(), `cdp-${process.pid}-${this.tmp.length}.html`);
    fs.writeFileSync(f, html, "utf8");
    this.tmp.push(f);
    await this.goto("file:///" + f.replace(/\\/g, "/"));
  }
  async evaluate(fn, arg) {
    const expression = `(async () => { const __r = await (${fn.toString()})(${JSON.stringify(arg ?? null)}); return __r; })()`;
    const r = await this.cdp.send("Runtime.evaluate", {
      expression, awaitPromise: true, returnByValue: true, allowUnsafeEvalBlockedByCSP: true,
    }, this.sid);
    if (r.exceptionDetails) throw new Error(r.exceptionDetails.exception?.description ?? r.exceptionDetails.text);
    return r.result.value;
  }
  async screenshot({ type = "png", quality } = {}) {
    const r = await this.cdp.send("Page.captureScreenshot", {
      format: type, ...(type === "jpeg" ? { quality } : {}), captureBeyondViewport: false,
    }, this.sid);
    const buf = Buffer.from(r.data, "base64");
    /* CLAUDE.md 第九節第 18 條：畫出來的尺寸一定要驗，被平切時不會有人報錯 */
    const got = pngJpegSize(buf);
    const want = { w: this.size.width * this.size.deviceScaleFactor, h: this.size.height * this.size.deviceScaleFactor };
    if (got && (got.w !== want.w || got.h !== want.h)) {
      throw new Error(`截圖尺寸 ${got.w}×${got.h} 對不上 ${want.w}×${want.h} —— 不要用這張，先查瀏覽器`);
    }
    return buf;
  }
  _cleanup() { for (const f of this.tmp) { try { fs.unlinkSync(f); } catch {} } }
}

/* 讀 PNG／JPEG 檔頭拿寬高（同 build.mjs 的 jpegSize()，這站沒有影像相依套件） */
function pngJpegSize(buf) {
  if (buf.length > 24 && buf[0] === 0x89 && buf[1] === 0x50) return { w: buf.readUInt32BE(16), h: buf.readUInt32BE(20) };
  if (buf[0] === 0xff && buf[1] === 0xd8) {
    let i = 2;
    while (i < buf.length) {
      if (buf[i] !== 0xff) { i++; continue; }
      const m = buf[i + 1];
      if (m >= 0xc0 && m <= 0xcf && m !== 0xc4 && m !== 0xc8 && m !== 0xcc)
        return { h: buf.readUInt16BE(i + 5), w: buf.readUInt16BE(i + 7) };
      i += 2 + buf.readUInt16BE(i + 2);
    }
  }
  return null;
}

class Browser {
  constructor(proc, cdp, userDataDir) { this.proc = proc; this.cdp = cdp; this.userDataDir = userDataDir; this.pages = []; }
  async newPage(opts = {}) {
    const size = {
      width: opts.viewport?.width ?? 1200,
      height: opts.viewport?.height ?? 628,
      deviceScaleFactor: opts.deviceScaleFactor ?? 1,
    };
    const { targetId } = await this.cdp.send("Target.createTarget", { url: "about:blank" });
    const { sessionId } = await this.cdp.send("Target.attachToTarget", { targetId, flatten: true });
    const pg = new Page(this.cdp, sessionId, size);
    await pg._init();
    this.pages.push(pg);
    return pg;
  }
  async close() {
    for (const p of this.pages) p._cleanup();
    try { await this.cdp.send("Browser.close"); } catch {}
    try { this.cdp.ws.close(); } catch {}
    try { this.proc.kill(); } catch {}
    await new Promise((r) => setTimeout(r, 150));
    try { fs.rmSync(this.userDataDir, { recursive: true, force: true }); } catch {}
  }
}

export const chromium = {
  async launch({ executablePath } = {}) {
    const exe = executablePath || process.env.CHROME_PATH;
    if (!exe || !fs.existsSync(exe)) throw new Error("找不到 Chrome，請設 CHROME_PATH");
    const userDataDir = fs.mkdtempSync(path.join(os.tmpdir(), "cdp-profile-"));
    const proc = spawn(exe, [
      "--headless=new", "--remote-debugging-port=0", `--user-data-dir=${userDataDir}`,
      "--no-first-run", "--no-default-browser-check", "--disable-extensions",
      "--disable-gpu", "--hide-scrollbars", "--force-device-scale-factor=1",
      "--allow-file-access-from-files", "about:blank",
    ], { stdio: ["ignore", "pipe", "pipe"] });

    const wsUrl = await new Promise((resolve, reject) => {
      let buf = "";
      const t = setTimeout(() => reject(new Error("等不到 Chrome 的 DevTools endpoint")), 30000);
      proc.stderr.on("data", (d) => {
        buf += d.toString();
        const m = buf.match(/ws:\/\/[^\s]+/);
        if (m) { clearTimeout(t); resolve(m[0]); }
      });
      proc.on("exit", (c) => { clearTimeout(t); reject(new Error(`Chrome 結束了（${c}）：${buf.slice(-400)}`)); });
    });

    const ws = new WebSocket(wsUrl);
    await waitFor(ws, "open");
    return new Browser(proc, new CDP(ws), userDataDir);
  },
};

export default { chromium };
