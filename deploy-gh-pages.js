const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Starting GitHub Pages deployment...');

try {
  // Build the React app
  console.log('📦 Building React app...');
  execSync('npm run build', { stdio: 'inherit' });

  // Create or checkout gh-pages branch
  console.log('🌿 Setting up gh-pages branch...');
  try {
    execSync('git checkout gh-pages', { stdio: 'inherit' });
  } catch (error) {
    console.log('Creating new gh-pages branch...');
    execSync('git checkout --orphan gh-pages', { stdio: 'inherit' });
    execSync('git rm -rf .', { stdio: 'inherit' });
  }

  // Copy build files to root
  console.log('📁 Copying build files...');
  const buildDir = path.join(__dirname, 'build');
  const files = fs.readdirSync(buildDir);
  
  files.forEach(file => {
    const srcPath = path.join(buildDir, file);
    const destPath = path.join(__dirname, file);
    
    if (fs.statSync(srcPath).isDirectory()) {
      execSync(`cp -r "${srcPath}" "${destPath}"`, { stdio: 'inherit' });
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  });

  // Create .nojekyll file for React Router
  fs.writeFileSync('.nojekyll', '');

  // Add and commit changes
  console.log('💾 Committing changes...');
  execSync('git add .', { stdio: 'inherit' });
  execSync('git commit -m "Deploy to GitHub Pages"', { stdio: 'inherit' });

  // Push to gh-pages branch
  console.log('🚀 Pushing to GitHub Pages...');
  execSync('git push origin gh-pages', { stdio: 'inherit' });

  // Switch back to main branch
  execSync('git checkout main', { stdio: 'inherit' });

  console.log('✅ Successfully deployed to GitHub Pages!');
  console.log('🌐 Your site should be available at: https://donovanmckee29-prog.github.io/HypeFlowAIV3/');

} catch (error) {
  console.error('❌ Deployment failed:', error.message);
  process.exit(1);
}

