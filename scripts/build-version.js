#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Get the version config
const versionConfigPath = path.join(__dirname, '..', 'version.config.js');
const versionConfig = require(versionConfigPath);

// Get git commit hash
function getGitCommit() {
  try {
    return execSync('git rev-parse --short HEAD', { encoding: 'utf8' }).trim();
  } catch (error) {
    return 'unknown';
  }
}

// Generate version.json for the build
function generateVersionJson() {
  const versionInfo = {
    ...versionConfig,
    buildDate: new Date().toISOString(),
    gitCommit: getGitCommit(),
    environment: process.env.NODE_ENV || 'development'
  };

  // Create assets directory if it doesn't exist
  const assetsDir = path.join(__dirname, '..', 'src', 'assets');
  if (!fs.existsSync(assetsDir)) {
    fs.mkdirSync(assetsDir, { recursive: true });
  }

  // Write version.json to assets
  const versionJsonPath = path.join(assetsDir, 'version.json');
  fs.writeFileSync(versionJsonPath, JSON.stringify(versionInfo, null, 2));
  
  console.log('✅ Generated version.json for build');
  console.log(`Version: ${versionInfo.version} (${versionInfo.buildNumber})`);
  console.log(`Build Date: ${versionInfo.buildDate}`);
  console.log(`Git Commit: ${versionInfo.gitCommit}`);
  console.log(`Environment: ${versionInfo.environment}`);
  
  return versionInfo;
}

// Generate version info for Angular environment
function generateAngularEnvironment() {
  const versionInfo = {
    ...versionConfig,
    buildDate: new Date().toISOString(),
    gitCommit: getGitCommit(),
    environment: process.env.NODE_ENV || 'development'
  };

  // Create environment directory if it doesn't exist
  const envDir = path.join(__dirname, '..', 'src', 'environments');
  if (!fs.existsSync(envDir)) {
    fs.mkdirSync(envDir, { recursive: true });
  }

  // Generate environment.ts
  const envContent = `export const environment = {
  production: ${process.env.NODE_ENV === 'production'},
  version: '${versionInfo.version}',
  buildNumber: ${versionInfo.buildNumber},
  versionCode: ${versionInfo.versionCode},
  buildDate: '${versionInfo.buildDate}',
  gitCommit: '${versionInfo.gitCommit}',
  appId: '${versionInfo.appId}',
  appName: '${versionInfo.appName}'
};
`;

  const envPath = path.join(envDir, 'environment.ts');
  fs.writeFileSync(envPath, envContent);
  
  console.log('✅ Generated Angular environment.ts');
  
  return versionInfo;
}

// Main function
function main() {
  const command = process.argv[2];
  
  switch (command) {
    case 'version-json':
      generateVersionJson();
      break;
      
    case 'environment':
      generateAngularEnvironment();
      break;
      
    case 'android':
      try {
        const { updateAndroidVariables, updateAndroidBuildGradle } = require('./update-android-version');
        updateAndroidVariables();
        updateAndroidBuildGradle();
      } catch (error) {
        console.log('⚠️ Android version update skipped (update-android-version.js not found)');
      }
      break;
      
    case 'all':
      generateVersionJson();
      generateAngularEnvironment();
      try {
        const { updateAndroidVariables, updateAndroidBuildGradle } = require('./update-android-version');
        updateAndroidVariables();
        updateAndroidBuildGradle();
      } catch (error) {
        console.log('⚠️ Android version update skipped (update-android-version.js not found)');
      }
      break;
      
    default:
      console.log('Usage: node build-version.js [version-json|environment|android|all]');
      console.log('  version-json: Generate version.json for assets');
      console.log('  environment: Generate Angular environment files');
      console.log('  android: Update Android version information');
      console.log('  all: Generate all files and update Android');
      break;
  }
}

if (require.main === module) {
  main();
}

module.exports = { generateVersionJson, generateAngularEnvironment };
