# Rutgers Dashboard - Development Guide

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
├── *.html                     # Other dashboard pages
├── src/
│   ├── ts/                    # TypeScript source code
│   │   ├── main.ts           # Main application logic
│   │   ├── components/       # UI components
│   │   ├── types/           # TypeScript type definitions
│   │   └── utils/           # Utility functions
│   └── input.css            # Tailwind CSS input
├── dist/                     # Compiled output
│   ├── js/                  # Compiled JavaScript
│   └── styles.css           # Compiled CSS
├── server/                  # Backend (Express + PostgreSQL)
├── vite.config.ts          # Vite configuration
└── package.json            # Frontend dependencies
```

## 🛠 Development Commands

### Frontend (Vite)
```bash
npm run dev          # Start Vite dev server (http://localhost:5173)
npm run vite:build   # Build for production
npm run vite:preview # Preview production build
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

## 🔧 Key Features

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

## 🌐 Access Points

- **Frontend Dashboard**: http://localhost:5173
- **Backend API**: http://localhost:4000/api
- **Health Check**: http://localhost:4000/health
- **Prisma Studio**: http://localhost:5555 (run `npm run db:studio`)

## 🔄 Development Workflow

1. **Start Development**: `./dev.sh`
2. **Edit TypeScript**: Files in `src/ts/`
3. **Edit HTML**: Update dashboard pages
4. **Edit Backend**: Files in `server/src/`
5. **Database Changes**: Update `server/prisma/schema.prisma`, then `npm run db:migrate`

## 🐛 Troubleshooting

### Frontend Issues
- **Build Errors**: Run `npm run type-check` to see TypeScript errors
- **Missing Dependencies**: Run `npm install`
- **Vite Issues**: Check `vite.config.ts` configuration

### Backend Issues
- **Database Connection**: Ensure PostgreSQL is running and `.env` is configured
- **API Errors**: Check server logs at http://localhost:4000/health
- **Migration Issues**: Run `npm run db:generate` then `npm run db:migrate`

### General Issues
- **Port Conflicts**: Change ports in `vite.config.ts` or `server/src/index.ts`
- **Permission Issues**: Run `chmod +x dev.sh` for the development script

## 📝 Notes

- The project now uses **Vite** instead of the old Python HTTP server
- All JavaScript is compiled from TypeScript sources
- The old `static/js/main.js` has been removed to prevent conflicts
- HTML files now reference `/dist/js/main.js` (compiled TypeScript)
- Both frontend and backend use TypeScript for type safety

## 🚀 Production Deployment

```bash
# Build frontend
npm run vite:build

# Build backend
cd server && npm run build

# The built files will be in `dist/` and `server/dist/`
```

---

**Happy coding! 🎉** 