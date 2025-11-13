#!/usr/bin/env node

/**
 * VibeCall Deployment Verification Script
 * Checks if the application is ready for production deployment
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 VibeCall Deployment Verification\n');

const checks = [
  {
    name: 'Package.json exists',
    check: () => fs.existsSync('package.json'),
    fix: 'Ensure package.json is in the root directory'
  },
  {
    name: 'Server package.json exists',
    check: () => fs.existsSync('server/package.json'),
    fix: 'Ensure server/package.json exists'
  },
  {
    name: 'Environment files configured',
    check: () => fs.existsSync('.env.production') && fs.existsSync('.env.local.example'),
    fix: 'Create .env.production and .env.local.example files'
  },
  {
    name: 'Vercel config exists',
    check: () => fs.existsSync('vercel.json'),
    fix: 'Create vercel.json configuration file'
  },
  {
    name: 'Render config exists',
    check: () => fs.existsSync('server/render.yaml'),
    fix: 'Create server/render.yaml configuration file'
  },
  {
    name: 'Git repository initialized',
    check: () => fs.existsSync('.git'),
    fix: 'Run: git init && git add . && git commit -m "Initial commit"'
  },
  {
    name: 'Build directory clean',
    check: () => !fs.existsSync('.next') || fs.readdirSync('.next').length === 0,
    fix: 'Clean build directory with: rm -rf .next'
  },
  {
    name: 'Health check endpoint exists',
    check: () => fs.existsSync('app/api/health/route.ts'),
    fix: 'Create health check API endpoint'
  },
  {
    name: 'PWA manifest exists',
    check: () => fs.existsSync('public/manifest.json'),
    fix: 'Create PWA manifest.json file'
  },
  {
    name: 'TypeScript config valid',
    check: () => {
      try {
        const tsconfig = JSON.parse(fs.readFileSync('tsconfig.json', 'utf8'));
        return tsconfig.compilerOptions && tsconfig.include;
      } catch {
        return false;
      }
    },
    fix: 'Ensure tsconfig.json is valid JSON'
  }
];

let passed = 0;
let failed = 0;

checks.forEach((check, index) => {
  const result = check.check();
  const status = result ? '✅' : '❌';
  const number = (index + 1).toString().padStart(2, '0');
  
  console.log(`${status} ${number}. ${check.name}`);
  
  if (result) {
    passed++;
  } else {
    failed++;
    console.log(`   💡 Fix: ${check.fix}`);
  }
});

console.log('\n📊 Verification Results:');
console.log(`✅ Passed: ${passed}`);
console.log(`❌ Failed: ${failed}`);
console.log(`📈 Score: ${Math.round((passed / checks.length) * 100)}%`);

if (failed === 0) {
  console.log('\n🎉 DEPLOYMENT READY!');
  console.log('✨ All checks passed. VibeCall is ready for production deployment.');
  console.log('\n🚀 Next steps:');
  console.log('1. Push to GitHub: git push origin main');
  console.log('2. Deploy to Vercel: https://vercel.com');
  console.log('3. Deploy to Render: https://render.com');
  console.log('4. Update environment variables');
  console.log('5. Test production deployment');
  
  process.exit(0);
} else {
  console.log('\n⚠️  DEPLOYMENT NOT READY');
  console.log('❌ Please fix the failed checks above before deploying.');
  console.log('\n📋 Run this script again after making fixes:');
  console.log('node verify-deployment.js');
  
  process.exit(1);
}
