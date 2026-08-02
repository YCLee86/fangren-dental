# =============================================================================
# 芳仁牙醫診所部落格 — 新電腦一鍵環境設定（Windows）
# -----------------------------------------------------------------------------
# 用法：在 PowerShell 執行
#     .\setup.ps1
# 指定安裝位置（預設 C:\MyProjects）：
#     .\setup.ps1 -Path D:\Work
#
# 這支腳本會：檢查並安裝 Node/Git/GitHub CLI → 登入 GitHub → clone 專案
#             → 設定 git 身分 → 驗證能不能正常建置
# 不會刪除任何既有檔案；專案資料夾已存在時改成更新（git pull）。
# =============================================================================

param(
    [string]$Path = "C:\MyProjects"
)

$ErrorActionPreference = "Stop"
$RepoUrl  = "https://github.com/YCLee86/fangren-dental.git"
$RepoName = "fangren-dental"
$ProjectPath = Join-Path $Path $RepoName
$installedSomething = $false

function Write-Step($n, $msg) {
    Write-Host ""
    Write-Host "[$n] $msg" -ForegroundColor Cyan
}
function Write-Ok($msg)   { Write-Host "    OK  $msg" -ForegroundColor Green }
function Write-Warn2($msg){ Write-Host "    !!  $msg" -ForegroundColor Yellow }
function Have($cmd) {
    $null -ne (Get-Command $cmd -ErrorAction SilentlyContinue)
}
function Install-Via-Winget($id, $label) {
    if (-not (Have "winget")) {
        Write-Warn2 "找不到 winget，請手動安裝 $label 後再執行一次這支腳本。"
        exit 1
    }
    Write-Host "    正在安裝 $label ..." -ForegroundColor Gray
    winget install --id $id -e --accept-source-agreements --accept-package-agreements
    if ($LASTEXITCODE -ne 0) {
        Write-Warn2 "$label 安裝失敗，請手動安裝後再執行一次。"
        exit 1
    }
    $script:installedSomething = $true
}

Write-Host ""
Write-Host "===== 芳仁牙醫診所部落格 — 新電腦環境設定 =====" -ForegroundColor White

# --- 1. Git -----------------------------------------------------------------
Write-Step 1 "檢查 Git"
if (Have "git") {
    Write-Ok (git --version)
} else {
    Write-Warn2 "未安裝，開始安裝 Git"
    Install-Via-Winget "Git.Git" "Git"
}

# --- 2. Node ----------------------------------------------------------------
Write-Step 2 "檢查 Node.js（需要 20 以上）"
$needNode = $true
if (Have "node") {
    $nodeVer = (node -v)
    $major = 0
    if ($nodeVer -match '^v(\d+)\.') { $major = [int]$Matches[1] }
    if ($major -ge 20) {
        Write-Ok "Node $nodeVer"
        $needNode = $false
    } else {
        Write-Warn2 "Node $nodeVer 太舊，需要 20 以上"
    }
} else {
    Write-Warn2 "未安裝 Node.js"
}
if ($needNode) { Install-Via-Winget "OpenJS.NodeJS.LTS" "Node.js LTS" }

# --- 3. GitHub CLI ----------------------------------------------------------
Write-Step 3 "檢查 GitHub CLI"
if (Have "gh") {
    Write-Ok ((gh --version) -split "`n")[0]
} else {
    Write-Warn2 "未安裝，開始安裝 GitHub CLI"
    Install-Via-Winget "GitHub.cli" "GitHub CLI"
}

# 剛裝好的工具不在目前這個視窗的 PATH 裡，必須重開才找得到
if ($installedSomething) {
    Write-Host ""
    Write-Host "  已安裝新工具。請「關掉這個 PowerShell 視窗、重新開一個」，" -ForegroundColor Yellow
    Write-Host "  再執行一次這支腳本，才能接續後面的步驟。" -ForegroundColor Yellow
    Write-Host ""
    exit 0
}

# --- 4. 登入 GitHub ---------------------------------------------------------
Write-Step 4 "檢查 GitHub 登入狀態"
# 未登入時 gh 會往 stderr 寫訊息並回傳非 0。Windows PowerShell 5.1 對原生執行檔
# 用 2>&1 會把 stderr 包成 ErrorRecord，配上 $ErrorActionPreference = "Stop"
# 就成了終止性錯誤，所以這裡必須用 try/catch 包起來，只看離開碼。
$ghAuthed = $false
try {
    $null = gh auth status 2>&1
    $ghAuthed = ($LASTEXITCODE -eq 0)
} catch {
    $ghAuthed = $false
}
if ($ghAuthed) {
    Write-Ok "已登入 GitHub"
} else {
    Write-Warn2 "尚未登入，接下來會開瀏覽器讓你授權"
    Write-Host "    選項請選： GitHub.com -> HTTPS -> Yes -> Login with a web browser" -ForegroundColor Gray
    gh auth login
    if ($LASTEXITCODE -ne 0) {
        Write-Warn2 "登入未完成，請重新執行這支腳本。"
        exit 1
    }
    Write-Ok "登入完成"
}

# --- 5. 取得專案 ------------------------------------------------------------
Write-Step 5 "取得專案原始碼"
if (-not (Test-Path $Path)) {
    New-Item -ItemType Directory -Force -Path $Path | Out-Null
    Write-Ok "已建立資料夾 $Path"
}
if (Test-Path (Join-Path $ProjectPath ".git")) {
    Write-Ok "專案已存在，改為更新：$ProjectPath"
    Push-Location $ProjectPath
    git pull --rebase
    # pull 失敗不能默默放過，否則會拿著舊版繼續工作卻以為是最新的
    if ($LASTEXITCODE -ne 0) {
        Pop-Location
        Write-Host ""
        Write-Warn2 "更新失敗，你的本機有還沒提交的改動。三選一："
        Write-Host "      git stash        先收起來，pull 完再 git stash pop" -ForegroundColor Gray
        Write-Host "      git commit -am '說明'   直接提交後再執行一次" -ForegroundColor Gray
        Write-Host "      把上面的訊息貼給 Claude 處理" -ForegroundColor Gray
        Write-Host ""
        Write-Warn2 "處理完再執行一次這支腳本。"
        exit 1
    }
    Pop-Location
} elseif (Test-Path $ProjectPath) {
    Write-Warn2 "$ProjectPath 已存在但不是 git 專案。請先改名或移走，再執行一次。"
    exit 1
} else {
    git clone $RepoUrl $ProjectPath
    if ($LASTEXITCODE -ne 0) { Write-Warn2 "clone 失敗"; exit 1 }
    Write-Ok "已下載到 $ProjectPath"
}

# --- 6. git 身分（一定要設，否則 commit 會失敗）------------------------------
Write-Step 6 "設定 git 身分"
Push-Location $ProjectPath
$curName  = (git config user.name)
$curEmail = (git config user.email)
if ($curName -and $curEmail) {
    Write-Ok "已設定：$curName <$curEmail>"
} else {
    Write-Host "    這個專案沒有全域 git 身分，必須在這裡設定，否則 commit 會失敗。" -ForegroundColor Gray
    Write-Host "    請填「你自己的」GitHub 帳號與信箱（兩人各自填各自的）。" -ForegroundColor Gray
    $inName = Read-Host "    GitHub 使用者名稱"
    $inMail = Read-Host "    GitHub 信箱"
    if (-not $inName -or -not $inMail) {
        Write-Warn2 "沒有填寫，略過。之後請自己執行："
        Write-Host '      git config user.name "你的帳號"' -ForegroundColor Gray
        Write-Host '      git config user.email "你的信箱"' -ForegroundColor Gray
    } else {
        git config user.name  $inName
        git config user.email $inMail
        Write-Ok "已設定：$inName <$inMail>"
    }
}

# --- 7. 驗證 ----------------------------------------------------------------
Write-Step 7 "驗證專案能不能正常建置"
node tools/build.mjs --check
if ($LASTEXITCODE -ne 0) {
    Write-Warn2 "建置檢查失敗，請把上面的訊息貼給 Claude 看。"
    Pop-Location
    exit 1
}
Write-Ok "建置檢查通過"
Pop-Location

# --- 完成 -------------------------------------------------------------------
Write-Host ""
Write-Host "===== 設定完成 =====" -ForegroundColor Green
Write-Host ""
Write-Host "接下來：" -ForegroundColor White
Write-Host "  1. 打開 Claude Code Desktop"
Write-Host "  2. 工作資料夾選：$ProjectPath"
Write-Host "  3. Claude 會自動讀專案裡的 CLAUDE.md，知道所有規則"
Write-Host ""
Write-Host "本機預覽： node tools/serve.mjs   然後開 http://localhost:8791" -ForegroundColor Gray
Write-Host "每次開工前： git pull --rebase" -ForegroundColor Gray
Write-Host "改完上線：   node tools/build.mjs 然後 git add -A / commit / push" -ForegroundColor Gray
Write-Host ""
