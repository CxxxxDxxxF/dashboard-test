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

A comprehensive social media management dashboard for Rutgers University, featuring analytics, content creation, scheduling, and multi-platform management capabilities.

## 🎯 Project Overview

This dashboard provides a complete solution for managing Rutgers University's social media presence across multiple platforms including Instagram, Facebook, and Twitter. Built with modern web technologies and designed for scalability and maintainability.

## ✨ Key Features

### 📊 Analytics & Insights
- **Real-time engagement tracking** with beautiful charts
- **Multi-platform analytics** (Instagram, Facebook, Twitter)
- **Performance metrics** and trend analysis
- **Custom date range filtering** (7, 14, 30 days)

### 📝 Content Management
- **Multi-platform post creation** with rich text editor
- **Media library** with drag-and-drop upload
- **Post scheduling** and calendar management
- **Content templates** and AI-powered suggestions

### 🎨 Modern UI/UX
- **Responsive design** that works on all devices
- **Dark/Light theme** support
- **Smooth animations** and transitions
- **Accessibility compliant** (WCAG 2.1)

### 🔧 Technical Excellence
- **TypeScript** for type safety
- **Modern build system** with Vite
- **Component-based architecture**
- **RESTful API** with PostgreSQL database

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- PostgreSQL 14+
- npm or yarn

### 1. Install Dependencies
```bash
# Install frontend dependencies
npm install

# Install backend dependencies
cd server && npm install
```

### 2. Set Up Database
```bash
# Start PostgreSQL (if not already running)
brew services start postgresql@14

# Create database
createdb rutgers_dashboard

# Set up environment and run migrations
cd server
cp env.example .env
# Edit .env with your database URL: postgresql://yourusername@localhost:5432/rutgers_dashboard?schema=public
npm run db:migrate
```

### 3. Start Development Servers

#### Option A: Use the Development Script (Recommended)
```bash
# Start both frontend and backend
./dev.sh

# Or start only frontend
./dev.sh frontend

# Or start only backend
./dev.sh backend
```

#### Option B: Manual Start
```bash
# Terminal 1: Frontend (Vite)
npm run dev

# Terminal 2: Backend (Express)
cd server && npm run dev
```

## 📁 Project Structure

```
dashboard-test/
├── index.html                 # Main dashboard page
├── analytics.html             # Analytics dashboard
├── calendar.html              # Content calendar
├── post-composer.html         # Post creation tool
├── media-library.html         # Media management
├── settings.html              # Account settings
├── all-posts.html             # Post management
├── src/
│   ├── ts/                    # TypeScript source code
│   │   ├── main.ts           # Main application logic
│   │   ├── components/       # UI components
│   │   │   └── UIComponents.ts # Standardized UI components
│   │   ├── services/         # Business logic services
│   │   │   ├── AnalyticsService.ts
│   │   │   └── AnimationService.ts
│   │   ├── types/           # TypeScript type definitions
│   │   └── utils/           # Utility functions
│   ├── components.css       # Component styles
│   └── input.css            # Tailwind CSS input
├── dist/                     # Compiled output
├── server/                  # Backend (Express + PostgreSQL)
│   ├── src/
│   │   ├── controllers/     # API controllers
│   │   ├── services/        # Business logic
│   │   ├── routes/          # API routes
│   │   ├── middleware/      # Express middleware
│   │   └── utils/           # Server utilities
│   └── prisma/              # Database schema and migrations
├── vite.config.ts          # Vite configuration
└── package.json            # Frontend dependencies
```

## 🛠 Development Commands

### Frontend (Vite)
```bash
npm run dev          # Start Vite dev server (http://localhost:5173)
npm run build        # Build for production
npm run preview      # Preview production build
npm run type-check   # TypeScript type checking
npm run lint         # ESLint code linting
```

### Backend (Express)
```bash
cd server
npm run dev          # Start Express dev server (http://localhost:4000)
npm run build        # Build TypeScript
npm test            # Run tests
npm run db:studio   # Open Prisma Studio
```

### Both
```bash
./dev.sh            # Start both servers
npm run lint:all    # Lint both frontend and backend
npm run format      # Format all code
```

## 🌐 Access Points

- **Frontend Dashboard**: http://localhost:5173
- **Backend API**: http://localhost:4000/api
- **Health Check**: http://localhost:4000/health
- **Prisma Studio**: http://localhost:5555 (run `npm run db:studio`)

## 🎨 UI Components

The project includes a comprehensive UI component system:

### Buttons
- Primary, secondary, outline variants
- Multiple sizes (xs, sm, md, lg)
- Loading states and icons
- Accessibility compliant

### Cards
- Default, elevated, outlined variants
- Header, body, footer sections
- Hover effects and animations

### Charts
- Interactive engagement charts
- Responsive design
- Custom tooltips and animations
- Rutgers brand colors

### Modals & Notifications
- Responsive modal dialogs
- Toast notifications
- Click-outside-to-close functionality

## 🔧 Technical Stack

### Frontend
- **Vite** - Fast development server with hot reload
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS** - Utility-first CSS framework
- **DaisyUI** - Component library
- **Chart.js** - Data visualization
- **Alpine.js** - Lightweight JavaScript framework

### Backend
- **Express.js** - Web framework
- **PostgreSQL** - Database
- **Prisma** - Database ORM
- **TypeScript** - Type-safe server code
- **Winston** - Logging
- **Joi** - Validation

## 🚀 Production Deployment

### Vercel (Frontend)
```bash
npm run build
# Deploy dist/ folder to Vercel
```

### Railway/Heroku (Backend)
```bash
cd server
npm run build
# Deploy with environment variables
```

## 🐛 Troubleshooting

### Frontend Issues
- **Build Errors**: Run `npm run type-check` to see TypeScript errors
- **Missing Dependencies**: Run `npm install`
- **Vite Issues**: Check `vite.config.ts` configuration

### Backend Issues
- **Database Connection**: Ensure PostgreSQL is running and `.env` is configured
- **API Errors**: Check server logs at http://localhost:4000/health
- **Migration Issues**: Run `npm run db:generate` then `npm run db:migrate`

### Chart Issues
- **Blank Chart**: Check browser console for errors
- **Test Chart**: Run `testChart()` in browser console
- **CSP Errors**: Expected when backend is not running

## 📝 Development Notes

- The project uses **Vite** for fast development
- All JavaScript is compiled from TypeScript sources
- UI components are standardized and reusable
- Charts are interactive with Rutgers brand colors
- Backend API is RESTful with proper error handling

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

**Built with ❤️ for Rutgers University**