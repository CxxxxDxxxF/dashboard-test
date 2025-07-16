---
title: "Rutgers University Social Media Dashboard"
emoji: "📊"
colorFrom: "red"
colorTo: "purple"
sdk: static
app_file: index.html
pinned: false
hf_oauth: true
---

# Rutgers University Social Media Dashboard

A modern, responsive social media management dashboard built with Tailwind CSS, DaisyUI, and Chart.js. Designed specifically for Rutgers University's social media team with enhanced visual hierarchy and interactive features.

## ✨ New Features & Enhancements

### 🎨 Visual Improvements
- **Enhanced Stat Cards**: Gradient backgrounds, better typography, and improved visual hierarchy
- **Interactive Welcome Banner**: Dynamic background patterns, status indicators, and dual action buttons
- **Improved Chart Integration**: Multi-platform data visualization with export functionality
- **Better Color Scheme**: Consistent Rutgers branding with enhanced contrast and accessibility

### 🚀 Interactive Elements
- **Hover Effects**: Smooth transitions and micro-interactions throughout the interface
- **Scroll Animations**: Intersection Observer for stat cards and content sections
- **Enhanced Dropdowns**: Better styling and improved user experience
- **Modal Improvements**: Rich content display with engagement metrics

### 📊 Enhanced Analytics
- **Multi-Platform Charts**: Separate Instagram and Facebook engagement tracking
- **Export Functionality**: Download charts as PNG images
- **Interactive Tooltips**: Rich data display on chart hover
- **Time Range Selector**: DaisyUI-styled dropdown for different time periods

### 🤖 AI Recommendations
- **Priority Badges**: Visual indicators for recommendation importance
- **Interactive Cards**: Click animations and actionable content
- **Hashtag Tags**: Visual display of trending hashtags
- **Content Ideas**: Direct integration with post composer

### 🎯 UI/UX Improvements
- **DaisyUI Integration**: Professional component library for consistent design
- **Alpine.js**: Lightweight JavaScript framework for reactive interactions
- **Better Typography**: Improved font hierarchy and readability
- **Enhanced Icons**: Consistent Lucide icon usage throughout

## 🛠️ Technology Stack

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Styling**: Tailwind CSS 3.4.0, DaisyUI 4.7.2
- **Charts**: Chart.js 4.4.1
- **Interactions**: Alpine.js 3.13.5
- **Icons**: Lucide SVG Icons
- **Build Tool**: PostCSS, Autoprefixer

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd rutgers-dashboard
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Build the project**
   ```bash
   # Development build with watch mode
   npm run dev
   
   # Production build (minified)
   npm run build:prod
   
   # Test production deployment
   npm run deploy:test
   ```

4. **Start local server**
   ```bash
   npm start
   # Or use a local server
   python -m http.server 8000
   ```

## 🚀 Quick Deploy

### Netlify (Recommended)
1. Connect your GitHub repository to Netlify
2. Build command: `./build.sh prod`
3. Publish directory: `.`
4. Deploy automatically on push to main branch

### Vercel
1. Import your GitHub repository to Vercel
2. Framework preset: Other
3. Build command: `npm run build:prod`
4. Output directory: `.`

### GitHub Pages
1. Push to main branch
2. GitHub Actions will automatically build and deploy
3. Available at: `https://yourusername.github.io/repository-name`

📖 **Detailed deployment guide**: [DEPLOYMENT.md](./DEPLOYMENT.md)

## 🎨 Design System

### Color Palette
- **Primary**: Rutgers Red (#CC0033)
- **Secondary**: Blue (#2563eb)
- **Accent**: Purple (#9333ea)
- **Success**: Green (#36d399)
- **Warning**: Yellow (#fbbd23)
- **Error**: Red (#f87272)

### Typography
- **Font Family**: Poppins (Google Fonts)
- **Headings**: Bold weights for hierarchy
- **Body**: Regular weight for readability

### Components
- **Cards**: Soft shadows, rounded corners, hover effects
- **Buttons**: Gradient backgrounds, smooth transitions
- **Charts**: Custom styling with Rutgers branding
- **Modals**: Backdrop blur, smooth animations

## 📱 Responsive Design

The dashboard is fully responsive with:
- **Mobile-first approach**
- **Collapsible sidebar** for mobile devices
- **Adaptive grid layouts**
- **Touch-friendly interactions**

## 🔧 Customization

### Adding New Pages
1. Create a new HTML file in the root directory
2. Copy the sidebar structure from existing pages
3. Update navigation links in all pages
4. Add page-specific styles in `src/input.css`

### Modifying Colors
1. Update the color palette in `tailwind.config.js`
2. Modify DaisyUI theme colors
3. Rebuild the CSS with `npm run build:prod`

### Adding New Charts
1. Create chart data in `static/js/main.js`
2. Initialize Chart.js with custom options
3. Add chart container to HTML
4. Style with Tailwind classes

## 🚀 Performance Optimizations

- **Minified CSS** for production
- **Optimized images** and SVGs
- **Lazy loading** for chart components
- **Efficient animations** with CSS transforms
- **Reduced bundle size** with tree shaking

## 📊 Analytics Features

### Engagement Tracking
- **Multi-platform data** (Instagram, Facebook)
- **Time-based filtering** (7, 14, 30 days)
- **Export functionality** for reports
- **Interactive tooltips** with detailed metrics

### Content Management
- **Post scheduling** with visual calendar
- **Engagement metrics** for each post
- **Platform-specific** analytics
- **Performance insights** and recommendations

## 🤖 AI-Powered Features

### Smart Recommendations
- **Optimal posting times** based on engagement data
- **Trending hashtag** suggestions
- **Content ideas** with engagement predictions
- **Performance optimization** tips

### Automated Insights
- **Engagement rate** analysis
- **Growth trends** identification
- **Content performance** scoring
- **Audience behavior** insights

## 🔒 Security & Compliance

- **CSP (Content Security Policy)** enabled
- **XSS protection** with proper input sanitization
- **Secure external resources** loading
- **Privacy-compliant** analytics

## 📈 Future Enhancements

- [ ] **Dark mode** toggle
- [ ] **Real-time notifications**
- [ ] **Advanced analytics** dashboard
- [ ] **Multi-user** collaboration features
- [ ] **API integration** with social platforms
- [ ] **Automated posting** capabilities
- [ ] **Advanced reporting** tools
- [ ] **Mobile app** version

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🏫 About Rutgers University

This dashboard is designed specifically for Rutgers University's social media management needs, featuring the university's official branding and color scheme.

---

**Built with ❤️ for Rutgers University**