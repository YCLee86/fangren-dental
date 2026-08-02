#!/usr/bin/env node
/* =============================================================================
   把要上線的檔案組進 _site/
   -----------------------------------------------------------------------------
   只複製真正要對外的東西，tools/、site.json、README 等都不會進去。
   用 Node 寫是為了 Windows 本機與 Cloudflare / GitHub 的 Linux 環境行為一致。
   ============================================================================= */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const OUT = path.join(ROOT, "_site");

const ALWAYS = ["index.html", "404.html", "assets", "posts"];
const OPTIONAL = ["sitemap.xml", "robots.txt"];

fs.rmSync(OUT, { recursive: true, force: true });
fs.mkdirSync(OUT, { recursive: true });

let count = 0;
const copy = (name, required) => {
  const src = path.join(ROOT, name);
  if (!fs.existsSync(src)) {
    if (required) {
      console.error(`× 找不到 ${name}`);
      process.exitCode = 1;
    }
    return;
  }
  fs.cpSync(src, path.join(OUT, name), { recursive: true });
  count++;
};

ALWAYS.forEach((n) => copy(n, true));
OPTIONAL.forEach((n) => copy(n, false));

// GitHub Pages 用：告訴它不要跑 Jekyll
fs.writeFileSync(path.join(OUT, ".nojekyll"), "");

const files = [];
(function walk(dir) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    e.isDirectory() ? walk(p) : files.push(p);
  }
})(OUT);

console.log(`_site/ 已產生：${count} 個項目、共 ${files.length} 個檔案`);
