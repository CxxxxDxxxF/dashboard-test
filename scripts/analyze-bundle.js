const fs = require('fs');
const path = require('path');

function formatBytes(bytes) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

function analyzeBundle() {
  console.log('📊 Bundle Analysis');
  console.log('==================');
  
  const distPath = 'dist';
  const staticPath = 'static';
  
  if (!fs.existsSync(distPath)) {
    console.log('❌ Dist directory not found. Run build first.');
    return;
  }
  
  const files = fs.readdirSync(distPath);
  let totalSize = 0;
  
  console.log('\n📁 Built Assets:');
  files.forEach(file => {
    const filePath = path.join(distPath, file);
    const stats = fs.statSync(filePath);
    const size = stats.size;
    totalSize += size;
    
    console.log(`  ${file}: ${formatBytes(size)}`);
  });
  
  // Check static files
  if (fs.existsSync(staticPath)) {
    console.log('\n📁 Static Assets:');
    const staticFiles = fs.readdirSync(staticPath, { recursive: true });
    staticFiles.forEach(file => {
      if (typeof file === 'string' && !file.includes('/')) {
        const filePath = path.join(staticPath, file);
        const stats = fs.statSync(filePath);
        console.log(`  ${file}: ${formatBytes(stats.size)}`);
        totalSize += stats.size;
      }
    });
  }
  
  console.log(`\n📈 Total Bundle Size: ${formatBytes(totalSize)}`);
  
  // Performance recommendations
  console.log('\n🚀 Performance Recommendations:');
  
  if (totalSize > 500 * 1024) { // 500KB
    console.log('  ⚠️  Bundle is large. Consider:');
    console.log('     - Code splitting');
    console.log('     - Tree shaking');
    console.log('     - Lazy loading');
  }
  
  // Check for minified files
  const cssFile = path.join(distPath, 'styles.css');
  const jsFile = path.join(distPath, 'main.min.js');
  
  if (fs.existsSync(cssFile)) {
    const cssSize = fs.statSync(cssFile).size;
    if (cssSize > 100 * 1024) { // 100KB
      console.log('  ⚠️  CSS bundle is large. Consider:');
      console.log('     - Purge unused CSS');
      console.log('     - Critical CSS inlining');
      console.log('     - CSS splitting');
    }
  }
  
  if (fs.existsSync(jsFile)) {
    const jsSize = fs.statSync(jsFile).size;
    if (jsSize > 50 * 1024) { // 50KB
      console.log('  ⚠️  JavaScript bundle is large. Consider:');
      console.log('     - Code splitting');
      console.log('     - Lazy loading');
      console.log('     - Tree shaking');
    }
  }
  
  console.log('\n✅ Bundle analysis complete!');
}

analyzeBundle();