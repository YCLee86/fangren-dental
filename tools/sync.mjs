#!/usr/bin/env node
/* =============================================================================
   開工前自動同步遠端。
   -----------------------------------------------------------------------------
   由 .claude/settings.json 的 SessionStart hook 呼叫，也可以手動執行：
       node tools/sync.mjs

   用 Node 而不是 shell 腳本，是為了 Windows 與 Mac 共用同一份、不必處理
   PowerShell 與 bash 的差異（Node 是這個專案本來就必備的）。

   輸出一段 JSON 給 Claude Code，systemMessage 會顯示給使用者看。
   無論如何都以離開碼 0 結束 —— 同步失敗不該讓人開不了工。
   ============================================================================= */

import { execFileSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

/** 執行 git，回傳 { ok, out }。不拋例外。 */
function git(args) {
  try {
    const out = execFileSync("git", args, {
      cwd: ROOT,
      encoding: "utf8",
      stdio: ["ignore", "pipe", "pipe"],
      timeout: 60_000,
    });
    return { ok: true, out: (out || "").trim() };
  } catch (err) {
    const out = [err.stdout, err.stderr].filter(Boolean).join("\n").trim();
    return { ok: false, out: out || String(err.message || err) };
  }
}

/** 印出結果並結束。永遠 exit 0。 */
function done(message) {
  process.stdout.write(JSON.stringify({ systemMessage: message }));
  process.exit(0);
}

// 不是 git 專案就安靜結束（例如有人把資料夾複製出去用）
if (!git(["rev-parse", "--git-dir"]).ok) {
  process.exit(0);
}

const before = git(["rev-parse", "HEAD"]).out;

// --autostash：本機有還沒提交的改動時，git 會自動先收起來、rebase 完再放回來，
// 不會像純 pull --rebase 那樣直接失敗。
const pull = git(["pull", "--rebase", "--autostash"]);

if (!pull.ok) {
  const hint = /conflict/i.test(pull.out)
    ? "有衝突需要處理，直接跟 Claude 說「幫我處理同步衝突」。"
    : "可能是網路不通或遠端有問題。可以照常工作，但先不要 push。";
  done(`⚠ 自動同步失敗 —— ${hint}\n\n${pull.out}`);
}

const after = git(["rev-parse", "HEAD"]).out;

if (before === after) {
  done("✓ 已是最新版本，可以開始工作。");
}

const count = git(["rev-list", "--count", `${before}..${after}`]).out || "?";
const log = git(["log", "--oneline", "--no-decorate", `${before}..${after}`]).out;
const files = git(["diff", "--stat", `${before}..${after}`]).out.split("\n").pop();

done(
  `✓ 已同步遠端的 ${count} 個新 commit：\n${log}\n\n${files}\n\n` +
    "（另一台電腦推上來的改動已經在你的本機了）"
);
