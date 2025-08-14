#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Get the version config
const versionConfigPath = path.join(__dirname, '..', 'version.config.js');
const versionConfig = require(versionConfigPath);

// Update Android variables.gradle
function updateAndroidVariables() {
  const variablesPath = path.join(__dirname, '..', 'android', 'variables.gradle');
  let variables = fs.readFileSync(variablesPath, 'utf8');
  
  // Update versionCode
  variables = variables.replace(
    /versionCode\s*=\s*\d+/,
    `versionCode = ${versionConfig.versionCode}`
  );
  
  // Update versionName
  variables = variables.replace(
    /versionName\s*=\s*["'][^"']*["']/,
    `versionName = "${versionConfig.version}"`
  );
  
  fs.writeFileSync(variablesPath, variables);
  console.log('✅ Android variables.gradle updated');
}

// Update Android build.gradle
function updateAndroidBuildGradle() {
  const buildGradlePath = path.join(__dirname, '..', 'android', 'app', 'build.gradle');
  let buildGradle = fs.readFileSync(buildGradlePath, 'utf8');
  
  // Update versionCode
  buildGradle = buildGradle.replace(
    /versionCode\s+rootProject\.ext\.versionCode\s*\?\s*:\s*\d+/,
    `versionCode ${versionConfig.versionCode}`
  );
  
  // Update versionName
  buildGradle = buildGradle.replace(
    /versionName\s+rootProject\.ext\.versionName\s*\?\s*:\s*["'][^"']*["']/,
    `versionName "${versionConfig.version}"`
  );
  
  fs.writeFileSync(buildGradlePath, buildGradle);
  console.log('✅ Android build.gradle updated');
}

// Main function
function main() {
  console.log('🔄 Updating Android version information...');
  console.log(`Version: ${versionConfig.version}`);
  console.log(`Version Code: ${versionConfig.versionCode}`);
  
  updateAndroidVariables();
  updateAndroidBuildGradle();
  
  console.log('✅ Android version information updated successfully');
}

if (require.main === module) {
  main();
}

module.exports = { updateAndroidVariables, updateAndroidBuildGradle };
