#!/bin/bash
cd /home/admin/nlgi

export NODE_ENV=production
export PATH=/usr/local/bin:/usr/bin:/bin

# AI Icon Factory - Quick Start Script
echo "🎨 AI Icon Factory - Quick Start"
echo "================================"

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v)
echo "✅ Node.js version: $NODE_VERSION"

# Install dependencies
echo "📦 Installing dependencies..."
npm run install-all

if [ $? -ne 0 ]; then
    echo "❌ Failed to install dependencies"
    exit 1
fi

echo "✅ Dependencies installed successfully!"

# Check if AI API key is configured
if ! grep -q "your_zhipuai_api_key_here" server/.env; then
    echo "✅ AI API key is configured"
else
    echo "⚠️  Warning: AI API key is not configured"
    echo "   Please edit server/.env and add your ZhipuAI API key"
    echo "   Get your API key from: https://open.bigmodel.cn/"
fi

# Start the application
echo "🚀 Starting AI Icon Factory..."
echo ""
echo "The application will be available at:"
echo "  Backend:  http://localhost:3001"
echo ""
echo "Press Ctrl+C to stop the application"
echo ""

npm run build
echo "✅ Build completed successfully!"

npm run server
echo "✅ AI Icon Factory is running!"