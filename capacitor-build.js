
#!/usr/bin/env node
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
};

/**
 * Executes a command and returns its output
 */
function runCommand(command, options = {}) {
  try {
    console.log(`${colors.blue}> ${command}${colors.reset}`);
    return execSync(command, { stdio: 'inherit', ...options });
  } catch (error) {
    console.error(`${colors.red}Error executing command: ${command}${colors.reset}`);
    throw error;
  }
}

/**
 * Main build function
 */
async function build() {
  try {
    // Step 1: Build the web app
    console.log(`\n${colors.bright}${colors.green}Step 1: Building web app...${colors.reset}\n`);
    runCommand('npm run build');

    // Step 2: Sync Capacitor
    console.log(`\n${colors.bright}${colors.green}Step 2: Syncing with Capacitor...${colors.reset}\n`);
    runCommand('npx cap sync');

    // Step 3: Ask which platform to build for
    console.log(`\n${colors.bright}${colors.green}Build completed successfully!${colors.reset}\n`);
    console.log(`${colors.yellow}Next steps:${colors.reset}`);
    console.log(`${colors.bright}- Run ${colors.blue}npx cap open ios${colors.reset} to open in Xcode`);
    console.log(`${colors.bright}- Run ${colors.blue}npx cap open android${colors.reset} to open in Android Studio`);
    console.log(`${colors.bright}- Run ${colors.blue}npx cap run ios${colors.reset} to build and run on an iOS device/simulator`);
    console.log(`${colors.bright}- Run ${colors.blue}npx cap run android${colors.reset} to build and run on an Android device/emulator`);

  } catch (error) {
    console.error(`\n${colors.bright}${colors.red}Build failed!${colors.reset}\n`);
    process.exit(1);
  }
}

// Execute the build
build();
