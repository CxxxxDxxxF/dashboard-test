---
title: "Rutgers University Social Media Dashboard"
emoji: "📊"
colorFrom: "red"
colorTo: "purple"
sdk: static
app_file: index.html
pinned: false
---

# Rutgers University Social Media Dashboard

A modern, responsive dashboard for managing social media accounts at Rutgers University.

## Features

- **Responsive Design**: Works on desktop, tablet, and mobile devices
- **Real-time Analytics**: Engagement charts and statistics
- **Post Management**: View, edit, and manage social media posts
- **Event Calendar**: Track upcoming academic events
- **AI Recommendations**: Smart suggestions for posting times and content
- **Dark Mode Toggle**: Switch between light and dark themes
- **Accessibility**: WCAG compliant with proper ARIA labels and keyboard navigation

## Recent Fixes Applied

### 1. Accessibility Improvements
- Added `title` and `aria-label` attributes to all interactive elements
- Fixed missing accessible names for buttons and form controls
- Improved keyboard navigation and focus indicators

### 2. Content Security Policy (CSP)
- Added proper CSP meta tag to allow necessary resources
- Configured to allow inline scripts, external CDNs, and data URIs
- Prevents XSS attacks while maintaining functionality

### 3. Resource Loading Issues
- Replaced external placeholder images with embedded SVG data URIs
- Added error handling for Chart.js loading failures
- Improved fallback content when resources fail to load

### 4. External Link Security
- Added `rel="noopener noreferrer"` to all external links
- Prevents potential security vulnerabilities from external sites

### 5. Code Organization
- Moved inline styles to external CSS file (`style.css`)
- Improved maintainability and performance
- Better separation of concerns

### 6. Error Handling
- Added try-catch blocks around Chart.js initialization
- Graceful degradation when external resources fail
- Console warnings for debugging

## Browser Compatibility

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Performance Notes

- Uses Tailwind CSS CDN (not recommended for production)
- Consider installing Tailwind locally for production use
- Chart.js is loaded from CDN with fallback handling

## Development

### Prerequisites
- Node.js (v16 or higher)
- npm (v8 or higher)

### Setup and Build

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Build for development:**
   ```bash
   npm run dev
   # or
   ./build.sh
   ```

3. **Build for production:**
   ```bash
   npm run build:prod
   # or
   ./build.sh prod
   ```

4. **Open the dashboard:**
   - Open `index.html` in a web browser
   - For local development, you can use a simple HTTP server:
     ```bash
     npx serve .
     # or
     python -m http.server 8000
     ```

### Build Process
- Tailwind CSS is compiled from `src/input.css` to `dist/styles.css`
- JavaScript is externalized to `static/js/main.js`
- CSP-compliant with nonce-based script loading
- Production builds are minified and optimized

## File Structure

```
dashboard-test/
├── index.html              # Main dashboard page
├── all-posts.html          # Posts listing page
├── package.json            # Node.js dependencies and scripts
├── tailwind.config.js      # Tailwind CSS configuration
├── postcss.config.js       # PostCSS configuration
├── build.sh               # Build automation script
├── src/
│   └── input.css          # Source CSS for Tailwind processing
├── dist/
│   └── styles.css         # Compiled CSS (generated)
├── static/
│   └── js/
│       └── main.js        # Externalized JavaScript
└── README.md              # This file
```

## Known Issues

- ~~Tailwind CSS CDN warning~~ ✅ **Fixed** - Now uses local build
- ~~Feature policy warnings~~ ✅ **Fixed** - Removed unsupported policies
- ~~CSP warnings~~ ✅ **Fixed** - Proper CSP with nonce-based scripts
- Some browser feature policy warnings (non-critical, browser-specific)

## Future Improvements

- [ ] Implement local Tailwind CSS build
- [ ] Add more interactive features
- [ ] Implement real data integration
- [ ] Add user authentication
- [ ] Create mobile app version