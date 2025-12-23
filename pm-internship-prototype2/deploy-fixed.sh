#!/bin/bash

echo "🚀 Starting deployment process..."

# Build frontend
echo "📦 Building frontend..."
cd frontend
npm install
npm run build

# Copy _redirects to dist folder for Netlify
cp public/_redirects dist/ 2>/dev/null || echo "No _redirects file found"

echo "✅ Frontend build complete!"

# Build backend (if needed)
echo "🔧 Preparing backend..."
cd ..
pip install -r requirements.txt

echo "✅ Deployment preparation complete!"
echo ""
echo "📋 Deployment Instructions:"
echo "1. For Vercel: Deploy the frontend folder"
echo "2. For Netlify: Deploy the frontend/dist folder"  
echo "3. For Railway/Render: Deploy the root folder"
echo ""
echo "🔧 SPA Routing Fix:"
echo "- Vercel: Uses vercel.json rewrites"
echo "- Netlify: Uses _redirects file"
echo "- Other platforms: Use nginx.conf"
echo ""
echo "🤖 AI Matching Fix:"
echo "- XGBoost algorithm now generates realistic varied scores (60-95)"
echo "- No more everyone getting 100 score"
echo "- Proper candidate ranking by AI score"