# 切換到你的實際 repo 位置
Set-Location "C:\星泓 原D槽\星泓 檔案\星泓 電腦\程式\網頁\Project\HTML\zssdmrofficial.github.io"

# 設定帳號資訊
git config user.name "zssdmrofficial"
git config user.email "zssdmrofficial@gmail.com"

# 設定遠端倉庫
git remote set-url origin "https://zssdmrofficial@github.com/zssdmrofficial/zssdmrofficial.github.io.git"

Write-Output "✅ Done! Now you can run:"
Write-Output "git add ."
Write-Output "git commit -m 'update site'"
Write-Output "git push origin main"

Read-Host -Prompt "Press Enter to exit..."
