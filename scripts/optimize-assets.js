const fs = require('fs');
const path = require('path');
const imagemin = require('imagemin');
const imageminSvgo = require('imagemin-svgo');

async function optimizeAssets() {
  console.log('🔧 Optimizing assets...');
  
  try {
    // Optimize SVG icons
    const svgFiles = await imagemin(['static/icons.svg'], {
      destination: 'dist',
      plugins: [
        imageminSvgo({
          plugins: [
            { name: 'removeViewBox', active: false },
            { name: 'removeDimensions', active: true },
            { name: 'removeEmptyAttrs', active: true },
            { name: 'removeEmptyText', active: true },
            { name: 'removeEmptyContainers', active: true },
            { name: 'removeComments', active: true },
            { name: 'removeMetadata', active: true },
            { name: 'removeDoctype', active: true },
            { name: 'removeXMLProcInst', active: true },
            { name: 'removeEditorsNSData', active: true },
            { name: 'cleanupEnableBackground', active: true },
            { name: 'convertStyleToAttrs', active: true },
            { name: 'convertColors', active: true },
            { name: 'convertPathData', active: true },
            { name: 'convertTransform', active: true },
            { name: 'removeUnknownsAndDefaults', active: true },
            { name: 'removeNonInheritableGroupAttrs', active: true },
            { name: 'removeUselessStrokeAndFill', active: true },
            { name: 'removeUnusedNS', active: true },
            { name: 'cleanupNumericValues', active: true },
            { name: 'moveElemsAttrsToGroup', active: true },
            { name: 'moveGroupAttrsToElems', active: true },
            { name: 'collapseGroups', active: true },
            { name: 'removeRasterImages', active: false },
            { name: 'mergePaths', active: true },
            { name: 'convertShapeToPath', active: true },
            { name: 'sortAttrs', active: true },
            { name: 'removeTitle', active: true },
            { name: 'removeDesc', active: true }
          ]
        })
      ]
    });
    
    console.log('✅ SVG icons optimized');
    
    // Create optimized logo SVGs
    const rutgersLogo = `<svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="40" height="40" rx="20" fill="#CC0033"/>
      <text x="20" y="25" font-family="Arial" font-size="16" font-weight="bold" fill="white" text-anchor="middle">RU</text>
    </svg>`;
    
    const userAvatar = `<svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="20" cy="20" r="20" fill="#e5e7eb"/>
      <circle cx="20" cy="16" r="6" fill="#9ca3af"/>
      <path d="M8 32c0-6.627 5.373-12 12-12s12 5.373 12 12" fill="#9ca3af"/>
    </svg>`;
    
    // Write optimized logos
    fs.writeFileSync('dist/rutgers-logo.svg', rutgersLogo);
    fs.writeFileSync('dist/user-avatar.svg', userAvatar);
    
    console.log('✅ Logo SVGs created');
    
    // Create critical CSS
    const criticalCSS = `
      /* Critical CSS for above-the-fold content */
      body{font-family:'Poppins',sans-serif;margin:0;padding:0}
      .sidebar{position:fixed;height:100%;background:#fff;box-shadow:0 2px 15px -3px rgba(0,0,0,.07);width:16rem;display:flex;flex-direction:column;transition:all .3s ease}
      .content-area{min-height:100vh;margin-left:16rem;transition:all .3s ease}
      .bg-gray-50{background-color:#f9fafb}
      .bg-white{background-color:#fff}
      .text-red-800{color:#991b1b}
      .font-bold{font-weight:700}
      .p-4{padding:1rem}
      .px-6{padding-left:1.5rem;padding-right:1.5rem}
      .py-3{padding-top:.75rem;padding-bottom:.75rem}
      .flex{display:flex}
      .items-center{align-items:center}
      .justify-between{justify-content:space-between}
      .w-10{width:2.5rem}
      .h-10{height:2.5rem}
      .rounded-full{border-radius:9999px}
      .ml-3{margin-left:.75rem}
      .text-xl{font-size:1.25rem}
      .border-b{border-bottom-width:1px}
      .border-gray-200{border-color:#e5e7eb}
      .text-gray-500{color:#6b7280}
      .hover\\:text-gray-700:hover{color:#374151}
      .transition-transform{transition-property:transform}
      .duration-300{transition-duration:.3s}
      .hover\\:scale-110:hover{transform:scale(1.1)}
      .hidden{display:none}
      .md\\:block{display:none}
      @media (min-width:768px){.md\\:block{display:block}}
    `;
    
    fs.writeFileSync('dist/critical.css', criticalCSS);
    console.log('✅ Critical CSS created');
    
    // Create service worker for caching
    const serviceWorker = `
      const CACHE_NAME = 'rutgers-dashboard-v1';
      const urlsToCache = [
        '/',
        '/dist/styles.css',
        '/dist/main.min.js',
        '/static/icons.svg',
        '/dist/rutgers-logo.svg',
        '/dist/user-avatar.svg'
      ];

      self.addEventListener('install', event => {
        event.waitUntil(
          caches.open(CACHE_NAME)
            .then(cache => cache.addAll(urlsToCache))
        );
      });

      self.addEventListener('fetch', event => {
        event.respondWith(
          caches.match(event.request)
            .then(response => response || fetch(event.request))
        );
      });
    `;
    
    fs.writeFileSync('dist/sw.js', serviceWorker);
    console.log('✅ Service worker created');
    
  } catch (error) {
    console.error('❌ Error optimizing assets:', error);
  }
}

optimizeAssets();