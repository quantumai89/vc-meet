#!/bin/bash

# VibeCall Deployment Script
echo "🚀 Starting VibeCall deployment..."

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found. Please run this script from the project root."
    exit 1
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Install server dependencies
echo "📦 Installing server dependencies..."
cd server && npm install && cd ..

# Build the application
echo "🔨 Building application..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Build failed. Please fix errors and try again."
    exit 1
fi

# Run tests (if any)
echo "🧪 Running tests..."
# npm test

# Check if git is initialized
if [ ! -d ".git" ]; then
    echo "📝 Initializing git repository..."
    git init
    git add .
    git commit -m "Initial VibeCall deployment"
fi

echo "✅ Build successful! Ready for deployment."
echo ""
echo "📋 Next steps:"
echo "1. Push to GitHub: git push origin main"
echo "2. Deploy frontend to Vercel"
echo "3. Deploy backend to Render"
echo "4. Update environment variables"
echo ""
echo "🌐 Deployment URLs:"
echo "Frontend: https://your-app.vercel.app"
echo "Backend: https://your-server.onrender.com"
echo ""
echo "🎉 VibeCall is ready to go live!"
