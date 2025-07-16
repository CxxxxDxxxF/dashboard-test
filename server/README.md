# Rutgers University Social Media Dashboard - Backend API

A production-ready Node.js/Express backend for the Rutgers University Social Media Dashboard, featuring real social media API integrations, PostgreSQL persistence, comprehensive analytics, and robust error handling.

## 🚀 Features

### Core Functionality
- **Social Media Integration**: Real API connections to Facebook, Instagram, and Twitter
- **Post Management**: Create, schedule, publish, and manage social media posts
- **Analytics Dashboard**: Comprehensive metrics and insights
- **Multi-platform Support**: Cross-platform posting and analytics
- **Real-time Data**: Live engagement tracking and metrics

### Technical Features
- **TypeScript**: Full type safety and modern development experience
- **PostgreSQL**: Robust relational database with Prisma ORM
- **Real API Integration**: Production-ready social media APIs
- **Mock Fallbacks**: Development-friendly mock data when APIs unavailable
- **Comprehensive Testing**: Unit and integration tests
- **Security**: Rate limiting, validation, and error handling
- **Logging**: Structured logging with Winston
- **Documentation**: OpenAPI/Swagger documentation

## 📋 Prerequisites

- Node.js 18+ 
- PostgreSQL 14+
- Social Media API credentials (optional for development)

## 🛠️ Installation

1. **Clone and navigate to server directory**
   ```bash
   cd server
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment setup**
   ```bash
   cp env.example .env
   ```

4. **Configure environment variables**
   ```env
   # Database
   DATABASE_URL="postgresql://username:password@localhost:5432/rutgers_dashboard"
   
   # Server
   PORT=4000
   NODE_ENV=development
   
   # Social Media APIs (optional for development)
   FACEBOOK_ACCESS_TOKEN=your_facebook_token
   FACEBOOK_PAGE_ID=your_page_id
   FACEBOOK_APP_ID=your_app_id
   FACEBOOK_APP_SECRET=your_app_secret
   
   INSTAGRAM_ACCESS_TOKEN=your_instagram_token
   INSTAGRAM_BUSINESS_ACCOUNT_ID=your_business_account_id
   
   TWITTER_API_KEY=your_twitter_api_key
   TWITTER_API_SECRET=your_twitter_api_secret
   TWITTER_ACCESS_TOKEN=your_twitter_access_token
   TWITTER_ACCESS_TOKEN_SECRET=your_twitter_access_token_secret
   
   # Frontend URL (for CORS)
   FRONTEND_URL=http://localhost:8000
   ```

5. **Database setup**
   ```bash
   # Generate Prisma client
   npm run db:generate
   
   # Run migrations
   npm run db:migrate
   
   # Seed database (optional)
   npm run db:seed
   ```

6. **Start development server**
   ```bash
   npm run dev
   ```

## 🏗️ Project Structure

```
server/
├── src/
│   ├── controllers/          # Request handlers
│   │   ├── postsController.ts
│   │   └── analyticsController.ts
│   ├── services/             # Business logic
│   │   ├── postService.ts
│   │   ├── analyticsService.ts
│   │   └── socialMediaService.ts
│   ├── routes/               # API routes
│   │   ├── posts.ts
│   │   ├── analytics.ts
│   │   └── socialAccounts.ts
│   ├── middleware/           # Custom middleware
│   │   ├── validation.ts
│   │   ├── errorHandler.ts
│   │   └── auth.ts
│   ├── config/               # Configuration
│   │   ├── database.ts
│   │   └── logger.ts
│   ├── utils/                # Utility functions
│   │   └── logger.ts
│   └── index.ts              # Application entry point
├── prisma/                   # Database schema and migrations
│   ├── schema.prisma
│   └── migrations/
├── tests/                    # Test files
├── logs/                     # Application logs
└── package.json
```

## 📚 API Documentation

### Base URL
```
http://localhost:4000/api
```

### Authentication
Currently using demo authentication. In production, implement JWT or OAuth.

### Endpoints

#### Posts API

**GET /api/posts**
- Get all posts with pagination and filtering
- Query params: `page`, `limit`, `platform`, `status`, `search`

**GET /api/posts/:id**
- Get a specific post by ID

**POST /api/posts**
- Create a new post
- Body: `title`, `content`, `platforms`, `imageUrl`, `scheduledAt`, `tags`

**PUT /api/posts/:id**
- Update an existing post

**DELETE /api/posts/:id**
- Delete a post

**POST /api/posts/:id/publish**
- Publish a post to social media platforms
- Body: `platforms` (array of platform names)

**GET /api/posts/:id/analytics**
- Get analytics for a specific post
- Query params: `period` (e.g., "7d", "30d")

**POST /api/posts/:id/duplicate**
- Duplicate a post

**POST /api/posts/bulk**
- Bulk operations on posts
- Body: `action`, `postIds`

#### Analytics API

**GET /api/analytics/dashboard**
- Get overall dashboard analytics
- Query params: `period`

**GET /api/analytics/platform**
- Get platform-specific analytics
- Query params: `platform`, `period`

**GET /api/analytics/engagement**
- Get engagement metrics
- Query params: `period`, `platform`

**GET /api/analytics/demographics**
- Get audience demographics
- Query params: `platform`

**GET /api/analytics/content**
- Get content performance insights
- Query params: `period`, `type`

**GET /api/analytics/trends**
- Get growth trends
- Query params: `metric`, `period`

**GET /api/analytics/competitors**
- Get competitor analysis
- Query params: `competitors` (comma-separated)

**GET /api/analytics/export**
- Export analytics data
- Query params: `format`, `period`, `metrics`

**GET /api/analytics/realtime**
- Get real-time analytics

#### Social Accounts API

**GET /api/social-accounts**
- Get connected social media accounts

**POST /api/social-accounts**
- Connect a new social media account

**DELETE /api/social-accounts/:id**
- Disconnect a social media account

### Response Format

All API responses follow this format:

```json
{
  "success": true,
  "data": { ... },
  "message": "Optional message",
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 100,
    "totalPages": 10
  }
}
```

Error responses:

```json
{
  "success": false,
  "message": "Error description",
  "errors": [
    {
      "field": "title",
      "message": "Title is required"
    }
  ]
}
```

## 🔧 Development

### Available Scripts

```bash
# Development
npm run dev              # Start development server with hot reload
npm run build            # Build for production
npm run start            # Start production server

# Database
npm run db:generate      # Generate Prisma client
npm run db:migrate       # Run database migrations
npm run db:studio        # Open Prisma Studio
npm run db:seed          # Seed database with sample data

# Testing
npm run test             # Run tests
npm run test:watch       # Run tests in watch mode
npm run test:coverage    # Run tests with coverage

# Code Quality
npm run lint             # Run ESLint
npm run lint:fix         # Fix ESLint errors
npm run format           # Format code with Prettier
```

### Environment Variables

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `DATABASE_URL` | PostgreSQL connection string | Yes | - |
| `PORT` | Server port | No | 4000 |
| `NODE_ENV` | Environment mode | No | development |
| `FRONTEND_URL` | Frontend URL for CORS | No | http://localhost:8000 |
| `FACEBOOK_*` | Facebook API credentials | No* | - |
| `INSTAGRAM_*` | Instagram API credentials | No* | - |
| `TWITTER_*` | Twitter API credentials | No* | - |

*Required for production, optional for development (uses mock data)

### Social Media API Setup

#### Facebook
1. Create a Facebook App at [developers.facebook.com](https://developers.facebook.com)
2. Add Facebook Login and Pages API permissions
3. Generate a Page Access Token
4. Set environment variables:
   ```env
   FACEBOOK_ACCESS_TOKEN=your_page_access_token
   FACEBOOK_PAGE_ID=your_page_id
   FACEBOOK_APP_ID=your_app_id
   FACEBOOK_APP_SECRET=your_app_secret
   ```

#### Instagram
1. Connect Instagram Business Account to Facebook Page
2. Use the same Facebook App credentials
3. Set environment variables:
   ```env
   INSTAGRAM_ACCESS_TOKEN=your_page_access_token
   INSTAGRAM_BUSINESS_ACCOUNT_ID=your_business_account_id
   ```

#### Twitter
1. Create a Twitter App at [developer.twitter.com](https://developer.twitter.com)
2. Generate API keys and access tokens
3. Set environment variables:
   ```env
   TWITTER_API_KEY=your_api_key
   TWITTER_API_SECRET=your_api_secret
   TWITTER_ACCESS_TOKEN=your_access_token
   TWITTER_ACCESS_TOKEN_SECRET=your_access_token_secret
   ```

## 🧪 Testing

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Run specific test file
npm test -- posts.test.ts
```

### Test Structure

```
tests/
├── unit/              # Unit tests
│   ├── services/
│   └── utils/
├── integration/       # Integration tests
│   ├── routes/
│   └── database/
└── fixtures/          # Test data
```

## 📊 Database Schema

The application uses PostgreSQL with the following main entities:

- **Posts**: Social media posts with content, scheduling, and status
- **Analytics**: Engagement metrics and performance data
- **Social Accounts**: Connected social media accounts
- **Users**: Application users (for future authentication)
- **Media**: Uploaded images and files

## 🔒 Security Features

- **Rate Limiting**: 100 requests per 15 minutes per IP
- **Input Validation**: Comprehensive request validation
- **CORS Protection**: Configurable cross-origin requests
- **Helmet**: Security headers
- **Error Handling**: Secure error responses
- **Logging**: Audit trail for all operations

## 🚀 Deployment

### Production Build

```bash
# Build the application
npm run build

# Start production server
npm start
```

### Environment Setup

1. Set `NODE_ENV=production`
2. Configure production database URL
3. Set up social media API credentials
4. Configure logging and monitoring
5. Set up SSL/TLS certificates

### Docker Deployment

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY dist ./dist
COPY prisma ./prisma

RUN npx prisma generate

EXPOSE 4000

CMD ["npm", "start"]
```

## 📝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Run linting and tests
6. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Check the API documentation
- Review the test files for usage examples
- Open an issue on GitHub

## 🔄 Changelog

### v1.0.0
- Initial release
- Complete social media integration
- Comprehensive analytics
- Production-ready architecture 