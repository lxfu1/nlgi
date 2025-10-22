#!/bin/bash

echo "🚀 Starting AI Icon Factory Development Server"
echo "=========================================="

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: Not in the project root directory"
    echo "Please run this script from the ai-icon-factory directory"
    exit 1
fi

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Error: Node.js is not installed"
    echo "Please install Node.js from https://nodejs.org/"
    exit 1
fi

echo "✅ Node.js version: $(node -v)"

# Check if dependencies are installed
if [ ! -d "node_modules" ] || [ ! -d "client/node_modules" ] || [ ! -d "server/node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm run install-all
    if [ $? -ne 0 ]; then
        echo "❌ Failed to install dependencies"
        exit 1
    fi
    echo "✅ Dependencies installed successfully"
fi

# Check if AI API key is configured
if grep -q "your_zhipuai_api_key_here" server/.env; then
    echo "⚠️  Warning: AI API key is not configured"
    echo "   Please edit server/.env and add your ZhipuAI API key"
    echo "   Get your API key from: https://open.bigmodel.cn/"
    echo ""
    echo "   Example:"
    echo "   AI_API_KEY=your_actual_api_key_here"
    echo ""
    read -p "Press Enter to continue without AI API key..."
fi

# Start the development server
echo "🚀 Starting development servers..."
echo "   Frontend: http://localhost:3000"
echo "   Backend:  http://localhost:3001"
echo "   Health:  http://localhost:3001/health"
echo ""
echo "Press Ctrl+C to stop the servers"
echo ""

npm run dev