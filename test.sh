#!/bin/bash

# NimbusAI Test Runner
echo "🧪 Running NimbusAI Test Suite..."
echo "=================================="

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

# Run linting
echo "🔍 Running ESLint..."
npm run lint

# Run type checking
echo "📝 Running TypeScript checks..."
npx tsc --noEmit

# Run unit tests
echo "🧪 Running unit tests..."
npm test

# Run tests with coverage
echo "📊 Running tests with coverage..."
npm run test:coverage

# Check coverage thresholds
echo "✅ Test suite completed!"
echo "=================================="

# Display coverage summary
if [ -d "coverage" ]; then
    echo "📈 Coverage Summary:"
    cat coverage/coverage-summary.json | jq '.total'
fi
