#!/bin/bash

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
echo "  Frontend: http://localhost:3000"
echo "  Backend:  http://localhost:3001"
echo ""
echo "Press Ctrl+C to stop the application"
echo ""

npm run build
echo "✅ Build completed successfully!"

echo "Copy build files to server home directory..."
mkdir -p ./server/build
cp -r ./client/build/* ./server/build
echo "✅ Files copied successfully!"

npm run server
echo "✅ AI Icon Factory is running!"