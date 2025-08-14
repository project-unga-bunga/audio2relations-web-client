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

// Update version config
function updateVersionConfig() {
  const newConfig = {
    ...versionConfig,
    buildNumber: versionConfig.buildNumber + 1,
    versionCode: versionConfig.versionCode + 1,
    buildDate: new Date().toISOString(),
    gitCommit: getGitCommit()
  };

  const configContent = `module.exports = ${JSON.stringify(newConfig, null, 2)};`;
  fs.writeFileSync(versionConfigPath, configContent);
  
  console.log(`✅ Version updated: ${newConfig.version} (${newConfig.buildNumber})`);
  console.log(`✅ Version code: ${newConfig.versionCode}`);
  console.log(`✅ Build date: ${newConfig.buildDate}`);
  console.log(`✅ Git commit: ${newConfig.gitCommit}`);
  
  return newConfig;
}

// Update package.json version
function updatePackageJson(newConfig) {
  const packageJsonPath = path.join(__dirname, '..', 'package.json');
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
  
  packageJson.version = newConfig.version;
  packageJson.buildNumber = newConfig.buildNumber;
  packageJson.buildDate = newConfig.buildDate;
  packageJson.gitCommit = newConfig.gitCommit;
  
  fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
  console.log('✅ package.json updated');
}

// Update Android build.gradle
function updateAndroidBuildGradle(newConfig) {
  const buildGradlePath = path.join(__dirname, '..', 'android', 'app', 'build.gradle');
  let buildGradle = fs.readFileSync(buildGradlePath, 'utf8');
  
  // Update versionCode
  buildGradle = buildGradle.replace(
    /versionCode\s+\d+/,
    `versionCode ${newConfig.versionCode}`
  );
  
  // Update versionName
  buildGradle = buildGradle.replace(
    /versionName\s+["'][^"']*["']/,
    `versionName "${newConfig.version}"`
  );
  
  fs.writeFileSync(buildGradlePath, buildGradle);
  console.log('✅ Android build.gradle updated');
}

// Update capacitor config
function updateCapacitorConfig(newConfig) {
  const capacitorConfigPath = path.join(__dirname, '..', 'capacitor.config.ts');
  let capacitorConfig = fs.readFileSync(capacitorConfigPath, 'utf8');
  
  // Add version info to config
  const versionInfo = `
  // Version information
  version: '${newConfig.version}',
  buildNumber: ${newConfig.buildNumber},
  versionCode: ${newConfig.versionCode},
  buildDate: '${newConfig.buildDate}',
  gitCommit: '${newConfig.gitCommit}',
`;
  
  // Insert version info after appName
  capacitorConfig = capacitorConfig.replace(
    /appName:\s*['"][^'"]*['"],/,
    `appName: '${newConfig.appName}',${versionInfo}`
  );
  
  fs.writeFileSync(capacitorConfigPath, capacitorConfig);
  console.log('✅ Capacitor config updated');
}

// Main function
function main() {
  const command = process.argv[2];
  
  switch (command) {
    case 'increment':
      console.log('🔄 Incrementing version...');
      const newConfig = updateVersionConfig();
      updatePackageJson(newConfig);
      updateAndroidBuildGradle(newConfig);
      updateCapacitorConfig(newConfig);
      break;
      
    case 'show':
      console.log('📱 Current version information:');
      console.log(`Version: ${versionConfig.version}`);
      console.log(`Build Number: ${versionConfig.buildNumber}`);
      console.log(`Version Code: ${versionConfig.versionCode}`);
      console.log(`Build Date: ${versionConfig.buildDate}`);
      console.log(`Git Commit: ${versionConfig.gitCommit}`);
      break;
      
    default:
      console.log('Usage: node version-manager.js [increment|show]');
      console.log('  increment: Increment build number and version code');
      console.log('  show: Display current version information');
      break;
  }
}

if (require.main === module) {
  main();
}

module.exports = { updateVersionConfig, getGitCommit };
