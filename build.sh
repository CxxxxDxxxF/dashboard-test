#!/bin/bash

# Rutgers Dashboard Build Script
echo "🚀 Building Rutgers Dashboard..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm first."
    exit 1
fi

# Install dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

# Create dist directory if it doesn't exist
if [ ! -d "dist" ]; then
    echo "📁 Creating dist directory..."
    mkdir -p dist
fi

# Build Tailwind CSS
echo "🎨 Building Tailwind CSS..."
if [ "$1" = "prod" ]; then
    echo "🏭 Production build..."
    npm run build:prod
else
    echo "🔧 Development build..."
    npm run build
fi

# Check if build was successful
if [ $? -eq 0 ]; then
    echo "✅ Build completed successfully!"
    echo "📊 File sizes:"
    ls -lh dist/
else
    echo "❌ Build failed!"
    exit 1
fi

echo "🎉 Dashboard is ready for deployment!" 