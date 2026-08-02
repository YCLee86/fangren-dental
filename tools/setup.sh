#!/usr/bin/env bash
# =============================================================================
# 芳仁牙醫診所部落格 — 新電腦一鍵環境設定（macOS / Linux）
# -----------------------------------------------------------------------------
# 用法：
#     bash setup.sh
# 指定安裝位置（預設 ~/Projects）：
#     bash setup.sh ~/Work
#
# 這支腳本會：檢查並安裝 Node/Git/GitHub CLI → 登入 GitHub → clone 專案
#             → 設定 git 身分 → 驗證能不能正常建置
# 不會刪除任何既有檔案；專案資料夾已存在時改成更新（git pull）。
# =============================================================================

set -u

BASE_PATH="${1:-$HOME/Projects}"
REPO_URL="https://github.com/YCLee86/fangren-dental.git"
REPO_NAME="fangren-dental"
PROJECT_PATH="$BASE_PATH/$REPO_NAME"

step() { printf "\n\033[36m[%s] %s\033[0m\n" "$1" "$2"; }
ok()   { printf "    \033[32mOK  %s\033[0m\n" "$1"; }
warn() { printf "    \033[33m!!  %s\033[0m\n" "$1"; }
have() { command -v "$1" >/dev/null 2>&1; }

brew_install() {
  if ! have brew; then
    warn "找不到 Homebrew，請先安裝：https://brew.sh  然後再執行一次這支腳本。"
    exit 1
  fi
  printf "    正在安裝 %s ...\n" "$2"
  if ! brew install "$1"; then
    warn "$2 安裝失敗，請手動安裝後再執行一次。"
    exit 1
  fi
}

printf "\n===== 芳仁牙醫診所部落格 — 新電腦環境設定 =====\n"

# --- 1. Git -----------------------------------------------------------------
step 1 "檢查 Git"
if have git; then
  ok "$(git --version)"
else
  warn "未安裝 Git"
  brew_install git "Git"
fi

# --- 2. Node ----------------------------------------------------------------
step 2 "檢查 Node.js（需要 20 以上）"
need_node=1
if have node; then
  node_ver="$(node -v)"
  major="$(printf '%s' "$node_ver" | sed 's/^v\([0-9]*\)\..*/\1/')"
  if [ "$major" -ge 20 ] 2>/dev/null; then
    ok "Node $node_ver"
    need_node=0
  else
    warn "Node $node_ver 太舊，需要 20 以上"
  fi
else
  warn "未安裝 Node.js"
fi
[ "$need_node" -eq 1 ] && brew_install node "Node.js"

# --- 3. GitHub CLI ----------------------------------------------------------
step 3 "檢查 GitHub CLI"
if have gh; then
  ok "$(gh --version | head -1)"
else
  warn "未安裝 GitHub CLI"
  brew_install gh "GitHub CLI"
fi

# --- 4. 登入 GitHub ---------------------------------------------------------
step 4 "檢查 GitHub 登入狀態"
if gh auth status >/dev/null 2>&1; then
  ok "已登入 GitHub"
else
  warn "尚未登入，接下來會開瀏覽器讓你授權"
  printf "    選項請選： GitHub.com -> HTTPS -> Yes -> Login with a web browser\n"
  if ! gh auth login; then
    warn "登入未完成，請重新執行這支腳本。"
    exit 1
  fi
  ok "登入完成"
fi

# --- 5. 取得專案 ------------------------------------------------------------
step 5 "取得專案原始碼"
mkdir -p "$BASE_PATH"
if [ -d "$PROJECT_PATH/.git" ]; then
  ok "專案已存在，改為更新：$PROJECT_PATH"
  git -C "$PROJECT_PATH" pull --rebase
elif [ -e "$PROJECT_PATH" ]; then
  warn "$PROJECT_PATH 已存在但不是 git 專案。請先改名或移走，再執行一次。"
  exit 1
else
  if ! git clone "$REPO_URL" "$PROJECT_PATH"; then
    warn "clone 失敗"
    exit 1
  fi
  ok "已下載到 $PROJECT_PATH"
fi

cd "$PROJECT_PATH" || exit 1

# --- 6. git 身分（一定要設，否則 commit 會失敗）------------------------------
step 6 "設定 git 身分"
cur_name="$(git config user.name || true)"
cur_mail="$(git config user.email || true)"
if [ -n "$cur_name" ] && [ -n "$cur_mail" ]; then
  ok "已設定：$cur_name <$cur_mail>"
else
  printf "    這個專案沒有全域 git 身分，必須在這裡設定，否則 commit 會失敗。\n"
  printf "    請填「你自己的」GitHub 帳號與信箱（兩人各自填各自的）。\n"
  printf "    GitHub 使用者名稱: "; read -r in_name
  printf "    GitHub 信箱: ";       read -r in_mail
  if [ -z "$in_name" ] || [ -z "$in_mail" ]; then
    warn "沒有填寫，略過。之後請自己執行："
    printf '      git config user.name "你的帳號"\n'
    printf '      git config user.email "你的信箱"\n'
  else
    git config user.name  "$in_name"
    git config user.email "$in_mail"
    ok "已設定：$in_name <$in_mail>"
  fi
fi

# --- 7. 驗證 ----------------------------------------------------------------
step 7 "驗證專案能不能正常建置"
if ! node tools/build.mjs --check; then
  warn "建置檢查失敗，請把上面的訊息貼給 Claude 看。"
  exit 1
fi
ok "建置檢查通過"

# --- 完成 -------------------------------------------------------------------
printf "\n\033[32m===== 設定完成 =====\033[0m\n\n"
printf "接下來：\n"
printf "  1. 打開 Claude Code Desktop\n"
printf "  2. 工作資料夾選：%s\n" "$PROJECT_PATH"
printf "  3. Claude 會自動讀專案裡的 CLAUDE.md，知道所有規則\n\n"
printf "本機預覽： node tools/serve.mjs   然後開 http://localhost:8791\n"
printf "每次開工前： git pull --rebase\n"
printf "改完上線：   node tools/build.mjs 然後 git add -A / commit / push\n\n"
