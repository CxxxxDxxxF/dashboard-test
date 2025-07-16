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

A modern, responsive social media management dashboard built with TypeScript, Tailwind CSS, and Node.js/Express. Features real PostgreSQL persistence, social media API integrations, and production-ready architecture.

## ✨ Features

### 🎨 Frontend
- **Modern UI/UX**: Tailwind CSS + DaisyUI components
- **TypeScript**: Full type safety and IntelliSense
- **Interactive Charts**: Chart.js with real-time data
- **Responsive Design**: Mobile-first approach
- **Accessibility**: WCAG 2.1 compliant

### 🔧 Backend
- **Node.js/Express**: RESTful API with TypeScript
- **PostgreSQL**: Production-ready database with Prisma ORM
- **Social Media APIs**: Real integrations with Instagram, Facebook, Twitter
- **Authentication**: JWT-based auth system
- **Rate Limiting**: API protection and monitoring
- **Logging**: Structured logging with Winston

### 📊 Analytics
- **Real-time Metrics**: Engagement, reach, impressions
- **Multi-platform**: Instagram, Facebook, Twitter, LinkedIn, TikTok
- **Export Functionality**: PDF/CSV reports
- **AI Insights**: Automated recommendations

## 🛠️ Technology Stack

### Frontend
- **TypeScript** 5.3.3
- **Tailwind CSS** 3.4.0 + **DaisyUI** 4.7.2
- **Chart.js** 4.4.1
- **Alpine.js** 3.13.5

### Backend
- **Node.js** 18+ with **Express** 4.18.2
- **TypeScript** 5.3.3
- **PostgreSQL** with **Prisma** ORM
- **JWT** Authentication
- **Winston** Logging

### DevOps
- **ESLint** + **Prettier** for code quality
- **Jest** for testing
- **Docker** ready
- **CI/CD** pipeline support

## 📦 Installation & Setup

### Prerequisites
- Node.js 18+ 
- PostgreSQL 12+
- Git

### 1. Clone Repository
```bash
git clone <repository-url>
cd rutgers-dashboard
```

### 2. Frontend Setup
```bash
# Install dependencies
npm install

# Build frontend
npm run build:prod

# Start development server
npm run dev
```

### 3. Backend Setup
```bash
# Navigate to server directory
cd server

# Install dependencies
npm install

# Copy environment file
cp env.example .env

# Configure database URL in .env
DATABASE_URL="postgresql://username:password@localhost:5432/rutgers_dashboard?schema=public"

# Generate Prisma client
npm run db:generate

# Run database migrations
npm run db:migrate

# Start development server
npm run dev
```

### 4. Database Setup
```bash
# Create PostgreSQL database
createdb rutgers_dashboard

# Run migrations (from server directory)
npm run db:migrate

# Seed with demo data (optional)
npm run db:seed
```

### 5. Environment Configuration
Create `.env` file in `server/` directory:

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/rutgers_dashboard?schema=public"

# Server
PORT=4000
NODE_ENV=development
FRONTEND_URL=http://localhost:8000

# Social Media APIs (for real integrations)
INSTAGRAM_APP_ID=your_instagram_app_id
INSTAGRAM_APP_SECRET=your_instagram_app_secret
FACEBOOK_APP_ID=your_facebook_app_id
FACEBOOK_APP_SECRET=your_facebook_app_secret

# Demo Mode (set to true for demo without API keys)
DEMO_MODE=true
```

## 🚀 Development Commands

### Frontend
```bash
# Development with hot reload
npm run dev

# Production build
npm run build:prod

# Type checking
npm run type-check

# Linting
npm run lint
```

### Backend
```bash
# Development server
npm run server:dev

# Production build
npm run server:build

# Start production server
npm run server:start

# Database operations
npm run db:migrate    # Run migrations
npm run db:studio     # Open Prisma Studio
npm run db:seed       # Seed database

# Testing
npm run test          # Run all tests
npm run test:backend  # Backend tests only
npm run test:coverage # Coverage report

# Code quality
npm run lint:all      # Lint frontend + backend
npm run format        # Format all code
```

## 📊 API Endpoints

### Health Check
- `GET /health` - Server health status
- `GET /api/health` - Detailed health check
- `GET /api/health/ready` - Readiness probe
- `GET /api/health/live` - Liveness probe

### Posts
- `GET /api/posts` - List posts with pagination
- `GET /api/posts/:id` - Get specific post
- `POST /api/posts` - Create new post
- `PUT /api/posts/:id` - Update post
- `DELETE /api/posts/:id` - Delete post
- `PATCH /api/posts/:id/status` - Update post status

### Analytics
- `GET /api/analytics/overview` - Analytics overview
- `GET /api/analytics/engagement` - Engagement metrics
- `GET /api/analytics/posts` - Post performance
- `POST /api/analytics/mock` - Create mock data

### Social Accounts
- `GET /api/social-accounts` - List connected accounts
- `POST /api/social-accounts` - Connect new account
- `PUT /api/social-accounts/:id` - Update account
- `DELETE /api/social-accounts/:id` - Disconnect account
- `POST /api/social-accounts/test-connection` - Test connection

#### Calendar API

**GET /api/calendar**
- List all calendar events

**POST /api/calendar**
- Create a new event

**PUT /api/calendar/:id**
- Update an event

**DELETE /api/calendar/:id**
- Delete an event

#### Media Library API

**GET /api/media**
- List all media files

**POST /api/media**
- Upload a new media file

**DELETE /api/media/:id**
- Delete a media file

#### Post Composer API

**POST /api/composer/draft**
- Save a post draft

**POST /api/composer/preview**
- Preview a post

**POST /api/composer/submit**
- Submit a post

#### Settings API

**GET /api/settings**
- Get user/app settings

**PUT /api/settings**
- Update user/app settings

## 🧪 Testing

### Frontend Tests
```