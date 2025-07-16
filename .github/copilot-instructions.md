# GitHub Copilot Instructions for Rutgers Social Media Dashboard

## Project Context
You are working on a production-ready Rutgers University Social Media Dashboard with:
- **Frontend**: TypeScript, Tailwind CSS, DaisyUI, Chart.js
- **Backend**: Node.js/Express, TypeScript, PostgreSQL, Prisma ORM
- **APIs**: Real social media integrations (Instagram/Facebook) with environment-driven keys

## Code Generation Guidelines

### TypeScript Requirements
- Always use strict TypeScript with proper type annotations
- Prefer interfaces over types for object shapes
- Use enums for constants and status values
- Avoid `any` type - use `unknown` or proper typing
- Implement proper error handling with typed errors

### Frontend Code
- Use Tailwind CSS utility classes for styling
- Implement DaisyUI components for consistent UI
- Use Chart.js for data visualization
- Follow React/Component best practices
- Implement proper accessibility (ARIA labels, semantic HTML)
- Use TypeScript for all frontend code

### Backend Code
- Use Express.js with TypeScript
- Implement proper middleware for security, logging, and error handling
- Use Prisma ORM for database operations
- Follow RESTful API design principles
- Implement proper validation
- Use Winston for structured logging

### Database Operations
- Use Prisma client for all database operations
- Implement proper error handling for database queries
- Use transactions where appropriate
- Follow naming conventions (snake_case for DB, camelCase for JS)

### Security Best Practices
- Never expose API keys or secrets in code
- Use environment variables for configuration
- Implement proper CORS settings
- Use rate limiting for API endpoints
- Validate all user inputs

### Error Handling
- Implement proper error boundaries in frontend
- Use structured error responses in API
- Log errors with appropriate levels
- Provide user-friendly error messages
- Handle edge cases gracefully

### Testing
- Write unit tests for all business logic
- Implement integration tests for API endpoints
- Use Jest for testing framework
- Mock external dependencies

### Performance
- Implement proper caching strategies
- Use database indexes for queries
- Optimize bundle sizes for frontend
- Use compression middleware

### Code Organization
- Follow SOLID principles
- Use proper separation of concerns
- Implement clean architecture patterns
- Use meaningful variable and function names
- Add proper JSDoc comments for complex functions

### Social Media Integration
- Implement proper API rate limiting
- Handle API failures gracefully
- Cache social media data appropriately
- Implement proper error handling for external APIs
- Use environment-driven configuration for API keys

## When Generating Code
1. Always consider security implications
2. Implement proper error handling
3. Use TypeScript with strict typing
4. Follow the established project patterns
5. Include appropriate comments and documentation
6. Consider performance implications
7. Ensure accessibility compliance
8. Write testable code

## File Naming Conventions
- Use kebab-case for file names
- Use PascalCase for component names
- Use camelCase for variables and functions
- Use UPPER_SNAKE_CASE for constants

## API Design
- Use RESTful conventions
- Implement proper HTTP status codes
- Use consistent response formats
- Include proper validation
- Implement rate limiting

Remember: This is a production application for Rutgers University, so prioritize security, performance, and maintainability in all code decisions. 