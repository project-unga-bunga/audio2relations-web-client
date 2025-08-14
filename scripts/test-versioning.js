#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🧪 Testing Version Management System...\n');

// Test 1: Check if version.config.js exists
console.log('1. Checking version.config.js...');
const versionConfigPath = path.join(__dirname, '..', 'version.config.js');
if (fs.existsSync(versionConfigPath)) {
  const versionConfig = require(versionConfigPath);
  console.log('   ✅ version.config.js found');
  console.log(`   📱 Version: ${versionConfig.version}`);
  console.log(`   🔢 Build Number: ${versionConfig.buildNumber}`);
  console.log(`   📦 Version Code: ${versionConfig.versionCode}`);
} else {
  console.log('   ❌ version.config.js not found');
  process.exit(1);
}

// Test 2: Check if package.json has version info
console.log('\n2. Checking package.json...');
const packageJsonPath = path.join(__dirname, '..', 'package.json');
if (fs.existsSync(packageJsonPath)) {
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
  console.log('   ✅ package.json found');
  console.log(`   📱 Version: ${packageJson.version}`);
  console.log(`   🔢 Build Number: ${packageJson.buildNumber || 'N/A'}`);
} else {
  console.log('   ❌ package.json not found');
}

// Test 3: Check if Android variables.gradle has version info
console.log('\n3. Checking Android variables.gradle...');
const variablesPath = path.join(__dirname, '..', 'android', 'variables.gradle');
if (fs.existsSync(variablesPath)) {
  const variables = fs.readFileSync(variablesPath, 'utf8');
  const versionCodeMatch = variables.match(/versionCode\s*=\s*(\d+)/);
  const versionNameMatch = variables.match(/versionName\s*=\s*["']([^"']+)["']/);
  
  if (versionCodeMatch && versionNameMatch) {
    console.log('   ✅ Android variables.gradle has version info');
    console.log(`   📦 Version Code: ${versionCodeMatch[1]}`);
    console.log(`   📱 Version Name: ${versionNameMatch[1]}`);
  } else {
    console.log('   ❌ Android variables.gradle missing version info');
  }
} else {
  console.log('   ❌ Android variables.gradle not found');
}

// Test 4: Check if version.json was generated
console.log('\n4. Checking generated version.json...');
const versionJsonPath = path.join(__dirname, '..', 'src', 'assets', 'version.json');
if (fs.existsSync(versionJsonPath)) {
  const versionJson = JSON.parse(fs.readFileSync(versionJsonPath, 'utf8'));
  console.log('   ✅ version.json generated');
  console.log(`   📱 Version: ${versionJson.version}`);
  console.log(`   🔢 Build Number: ${versionJson.buildNumber}`);
  console.log(`   📦 Version Code: ${versionJson.versionCode}`);
  console.log(`   🌍 Environment: ${versionJson.environment}`);
  console.log(`   📅 Build Date: ${versionJson.buildDate}`);
  console.log(`   🔗 Git Commit: ${versionJson.gitCommit}`);
} else {
  console.log('   ❌ version.json not generated');
}

// Test 5: Check if Angular environment.ts was generated
console.log('\n5. Checking Angular environment.ts...');
const envPath = path.join(__dirname, '..', 'src', 'environments', 'environment.ts');
if (fs.existsSync(envPath)) {
  console.log('   ✅ Angular environment.ts generated');
} else {
  console.log('   ❌ Angular environment.ts not generated');
}

// Test 6: Check if scripts are executable
console.log('\n6. Checking script permissions...');
const scripts = [
  'version-manager.js',
  'build-version.js',
  'update-android-version.js'
];

scripts.forEach(script => {
  const scriptPath = path.join(__dirname, script);
  if (fs.existsSync(scriptPath)) {
    const stats = fs.statSync(scriptPath);
    if (stats.mode & 0o111) {
      console.log(`   ✅ ${script} is executable`);
    } else {
      console.log(`   ⚠️  ${script} is not executable`);
    }
  } else {
    console.log(`   ❌ ${script} not found`);
  }
});

console.log('\n🎉 Version Management System Test Complete!');
console.log('\n📋 Next Steps:');
console.log('   1. Run: npm run version:show (to see current version)');
console.log('   2. Run: npm run version:increment (to increment version)');
console.log('   3. Run: npm run build:version (to generate version files)');
console.log('   4. Run: npm run build (to build with version info)');
console.log('   5. Run: npm run deploy:firebase (to deploy with version increment)');
