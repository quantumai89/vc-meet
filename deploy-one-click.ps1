# VibeCall One-Click Deployment Script
# This script will deploy your video calling app to Vercel for free

Write-Host "VibeCall One-Click Deployment Starting..." -ForegroundColor Green
Write-Host "Deploying your free video calling app..." -ForegroundColor Cyan

# Check if Node.js is installed
try {
    $nodeVersion = node --version
    Write-Host "Node.js detected: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "Node.js not found. Please install Node.js first." -ForegroundColor Red
    exit 1
}

# Install Vercel CLI globally if not present
Write-Host "Setting up Vercel CLI..." -ForegroundColor Yellow
try {
    vercel --version | Out-Null
    Write-Host "Vercel CLI already installed" -ForegroundColor Green
} catch {
    Write-Host "Installing Vercel CLI..." -ForegroundColor Yellow
    npm install -g vercel
}

# Install dependencies
Write-Host "Installing project dependencies..." -ForegroundColor Yellow
npm install

# Build the project
Write-Host "Building VibeCall app..." -ForegroundColor Yellow
npm run build

# Deploy to Vercel
Write-Host "Deploying to Vercel..." -ForegroundColor Cyan
Write-Host "You will need to login to Vercel (free account)" -ForegroundColor Yellow

# Deploy with production settings
vercel --prod --yes

Write-Host ""
Write-Host "VibeCall Deployment Complete!" -ForegroundColor Green
Write-Host "Your free video calling app is now live!" -ForegroundColor Cyan
Write-Host "Check the URL above to access your app" -ForegroundColor Yellow
