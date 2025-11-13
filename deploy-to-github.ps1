# VibeCall Automated Deployment Script
# Run this after creating the GitHub repository

Write-Host "🚀 VibeCall Deployment to GitHub" -ForegroundColor Cyan
Write-Host "=================================" -ForegroundColor Cyan

# Check if git is available
if (-not (Get-Command git -ErrorAction SilentlyContinue)) {
    Write-Host "❌ Git is not installed or not in PATH" -ForegroundColor Red
    exit 1
}

# Remove existing remote if any
Write-Host "🔧 Configuring Git remote..." -ForegroundColor Yellow
git remote remove origin 2>$null

# Add the new remote
git remote add origin https://github.com/kirtanPandya93/vid-meet.git

# Check if repository exists by trying to fetch
Write-Host "🔍 Checking repository accessibility..." -ForegroundColor Yellow
$null = git ls-remote origin 2>&1

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Repository not found or not accessible" -ForegroundColor Red
    Write-Host "📋 Please create the repository first:" -ForegroundColor Yellow
    Write-Host "   1. Go to https://github.com/kirtanPandya93" -ForegroundColor White
    Write-Host "   2. Click 'New Repository'" -ForegroundColor White
    Write-Host "   3. Name: vid-meet" -ForegroundColor White
    Write-Host "   4. Set to Public" -ForegroundColor White
    Write-Host "   5. Don't initialize with README" -ForegroundColor White
    Write-Host "   6. Click 'Create Repository'" -ForegroundColor White
    Write-Host "   7. Run this script again" -ForegroundColor White
    exit 1
}

# Push to GitHub
Write-Host "📤 Pushing code to GitHub..." -ForegroundColor Yellow
git branch -M main
git push -u origin main

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Successfully pushed to GitHub!" -ForegroundColor Green
    Write-Host ""
    Write-Host "🎯 Next Steps:" -ForegroundColor Cyan
    Write-Host "1. Deploy Backend to Render: https://render.com" -ForegroundColor White
    Write-Host "2. Deploy Frontend to Vercel: https://vercel.com" -ForegroundColor White
    Write-Host ""
    Write-Host "📋 Repository: https://github.com/kirtanPandya93/vid-meet" -ForegroundColor Green
    Write-Host "📖 Deployment Guide: See GITHUB_SETUP.md" -ForegroundColor Green
} else {
    Write-Host "❌ Failed to push to GitHub" -ForegroundColor Red
    Write-Host "Please check your GitHub credentials and repository access" -ForegroundColor Yellow
}
