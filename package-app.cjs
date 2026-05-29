const packager = require('electron-packager');
const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

async function runBuildAndPackage() {
  console.log('=== [DevFlow AI Build Vector Initiative] ===');
  
  try {
    // 1. Compile the production bundles
    console.log('1. Compiling production frontend and backend server...');
    execSync('npm run build', { stdio: 'inherit' });
    console.log('✓ Compilation completed successfully.');

    // 2. Guarantee that the output release-builds folder exists
    const outDir = path.join(__dirname, 'release-builds');
    if (!fs.existsSync(outDir)) {
      console.log(`Creating release build target directory at: ${outDir}`);
      fs.mkdirSync(outDir, { recursive: true });
    }

    // 3. Configure the electron-packager options
    console.log('2. Preparing Electron Packager configuration matrix...');
    
    // Pattern to exclude folders that are not needed at runtime to make copy super fast
    const ignoreRegexList = [
      /^\/\.git/,
      /^\/\.github/,
      /^\/src(\/|$)/,
      /^\/public(\/|$)/,
      /^\/release-builds(\/|$)/,
      /^\/\.env/,
      /^\/DESKTOP_BUILD_GUIDE\.md/,
      /^\/desktop\.py/,
      /^\/firebase-blueprint\.json/,
      /^\/firestore\.rules/,
      /^\/package-app\.cjs/,
      /^\/tsconfig\.json/,
      /^\/vite\.config\.ts/,
      /^\/\.gitignore/,
      /^\/README\.md/,
      /^\/metadata\.json/,
      /^\/netlify\.toml/,
      /^\/\.env\.example/
    ];

    const options = {
      dir: '.',
      name: 'DevFlowAI',
      platform: 'win32',
      arch: 'x64',
      out: 'release-builds',
      overwrite: true,
      asar: false, // Ensure transparent file system loading for child process execution
      ignore: (filePath) => {
        if (!filePath) return false;
        
        // Ensure path is relative to current directory
        let relativePath = filePath;
        if (path.isAbsolute(filePath)) {
          relativePath = path.relative(__dirname, filePath);
        }
        
        // Normalize slashes for matching and ensure it starts with /
        let normalizedPath = relativePath.replace(/\\/g, '/');
        if (!normalizedPath.startsWith('/')) {
          normalizedPath = '/' + normalizedPath;
        }
        
        // Check if any of the exclude patterns match
        const shouldIgnore = ignoreRegexList.some(regex => regex.test(normalizedPath));
        
        return shouldIgnore;
      },
      prune: true // Automatically prune devDependencies from packaged node_modules
    };

    console.log('3. Launching Electron Packager core. Please wait (this can take a moment)...');
    const appPaths = await packager(options);
    
    console.log('\n======================================================');
    console.log('✓ SUCCESS: DevFlow AI Windows packaging complete!');
    console.log('======================================================');
    console.log(`Output binary directory located at:\n${appPaths[0]}`);
    console.log('\nInstructions:');
    console.log(`1. Open file explorer: ii "${outDir}"`);
    console.log(`2. Double click "DevFlowAI.exe" to activate.`);
    console.log('======================================================');

  } catch (error) {
    console.error('\n❌ BUILD OR PACKAGING SYSTEM EXCEPTION DETECTED:');
    console.error(error.message || error);
    if (error.stack) {
      console.error(error.stack);
    }
    process.exit(1);
  }
}

runBuildAndPackage();
