#!/bin/bash

echo "🚀 Setting up Ysrap Etpe - Food Surplus App"
echo "=============================================="

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

# Check if MongoDB is running
if ! command -v mongod &> /dev/null; then
    echo "⚠️  MongoDB is not installed. Please install MongoDB or use MongoDB Atlas."
fi

echo "📦 Installing dependencies..."

# Install root dependencies
npm install

# Install server dependencies
echo "🔧 Installing server dependencies..."
cd server
npm install
cd ..

# Install admin panel dependencies
echo "🖥️  Installing admin panel dependencies..."
cd admin
npm install
cd ..

# Install mobile app dependencies
echo "📱 Installing mobile app dependencies..."
cd mobile
npm install
cd ..

echo ""
echo "✅ Setup complete!"
echo ""
echo "📋 Next steps:"
echo "1. Copy server/env.example to server/.env and configure your environment variables"
echo "2. Start MongoDB (if using local installation)"
echo "3. Start the server: cd server && npm run dev"
echo "4. Start the admin panel: cd admin && npm start"
echo "5. Start the mobile app: cd mobile && npm start"
echo ""
echo "🌐 Server will run on: http://localhost:5000"
echo "🖥️  Admin panel will run on: http://localhost:3000"
echo "📱 Mobile app will open Expo DevTools"
echo ""
echo "📚 For detailed instructions, see README.md"
