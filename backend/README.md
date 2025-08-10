# Finance Practice Backend API

## Overview
RESTful API backend for the Finance Practice Application, built with Node.js, Express, TypeScript, and PostgreSQL.

## Features
- **Authentication & Authorization**: JWT-based auth with refresh tokens
- **Project Management**: CRUD operations for accounting projects
- **Financial Statements**: P&L, Balance Sheet, Cash Flow management
- **Budget Planning**: ROI/IRR/NPV calculations
- **Learning System**: Case studies, exercises, progress tracking
- **Achievement System**: Badges and progress gamification
- **Database Persistence**: PostgreSQL with Flyway migrations
- **Caching**: Redis integration
- **API Documentation**: Swagger/OpenAPI
- **Logging**: Winston with structured logging
- **Error Handling**: Comprehensive error management
- **Health Checks**: Application and database monitoring

## Tech Stack
- **Runtime**: Node.js 18+
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: PostgreSQL 15
- **Cache**: Redis 7
- **Migrations**: Flyway
- **Authentication**: JWT + bcrypt
- **Validation**: Zod
- **Logging**: Winston
- **Documentation**: Swagger UI
- **Testing**: Jest + Supertest
- **Containerization**: Docker

## Prerequisites
- Node.js 18.0.0 or higher
- npm 9.0.0 or higher
- Docker and Docker Compose
- PostgreSQL 15 (via Docker)
- Redis 7 (via Docker)

## Quick Start

### 1. Environment Setup
```bash
# Copy environment template
cp .env.example .env

# Install dependencies
npm install
```

### 2. Database Setup
```bash
# Start database services
../scripts/setup-db.sh

# Or manually with docker-compose
docker-compose up -d postgres redis
```

### 3. Run Development Server
```bash
# Start the API server
npm run dev

# Server will be available at http://localhost:3001
# Health check: http://localhost:3001/health
# API docs: http://localhost:3001/api-docs
```

## Available Scripts

### Development
- `npm run dev` - Start development server with hot reload
- `npm run build` - Build TypeScript to JavaScript
- `npm start` - Start production server

### Database
- `npm run migrate` - Run Flyway migrations
- `npm run db:setup` - Setup database and run migrations
- `npm run db:reset` - Clean and re-migrate database
- `npm run db:seed` - Insert initial data

### Quality & Testing
- `npm test` - Run test suite
- `npm run test:watch` - Run tests in watch mode
- `npm run test:coverage` - Run tests with coverage report
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint issues
- `npm run format` - Format code with Prettier
- `npm run type-check` - TypeScript type checking

### Flyway Management
- `npm run flyway:info` - Show migration status
- `npm run flyway:validate` - Validate migrations
- `npm run flyway:clean` - Clean database (development only)

## API Endpoints

### Authentication
- `POST /api/v1/auth/register` - User registration
- `POST /api/v1/auth/login` - User login
- `POST /api/v1/auth/refresh` - Refresh access token
- `POST /api/v1/auth/logout` - User logout

### Users
- `GET /api/v1/users/profile` - Get user profile
- `PUT /api/v1/users/profile` - Update user profile
- `GET /api/v1/users/progress` - Get learning progress

### Projects
- `GET /api/v1/projects` - List projects
- `POST /api/v1/projects` - Create project
- `GET /api/v1/projects/:id` - Get project details
- `PUT /api/v1/projects/:id` - Update project
- `DELETE /api/v1/projects/:id` - Delete project
- `GET /api/v1/projects/:id/financial-statements` - Get financial statements
- `POST /api/v1/projects/:id/financial-statements` - Create financial statement
- `GET /api/v1/projects/:id/budget-plans` - Get budget plans
- `POST /api/v1/projects/:id/budget-plans` - Create budget plan

### Learning
- `GET /api/v1/learning/case-studies` - List case studies
- `GET /api/v1/learning/case-studies/:id` - Get case study
- `POST /api/v1/learning/case-studies/:id/attempt` - Start attempt
- `PUT /api/v1/learning/case-studies/:id/attempt/:attemptId` - Update attempt
- `GET /api/v1/learning/exercises` - List exercises
- `GET /api/v1/learning/exercises/:id` - Get exercise
- `POST /api/v1/learning/exercises/:id/attempt` - Submit exercise attempt
- `GET /api/v1/learning/progress` - Get learning progress
- `GET /api/v1/learning/achievements` - Get achievements

### Health & Monitoring
- `GET /health` - Application health check
- `GET /health/ping` - Simple ping endpoint
- `GET /health/version` - Version information

## Database Schema

### Core Tables
- **users** - User accounts and authentication
- **projects** - Accounting projects and cost tracking
- **financial_statements** - P&L, Balance Sheet, Cash Flow data
- **budget_plans** - Budget planning with ROI/IRR calculations

### Learning Tables
- **case_studies** - Interactive case study content
- **exercises** - Calculation exercises (ROI, depreciation, etc.)
- **learning_progress** - User progress tracking
- **case_study_attempts** - Case study completion records
- **exercise_attempts** - Exercise submission records
- **learning_sessions** - Learning activity sessions
- **achievements** - Badge/achievement definitions
- **user_achievements** - User-earned achievements

## Environment Variables

See `.env.example` for full configuration options.

### Required Variables
- `NODE_ENV` - Environment (development/production)
- `PORT` - API server port (default: 3001)
- `DB_*` - Database connection settings
- `JWT_SECRET` - JWT signing secret

### Optional Variables
- `REDIS_*` - Redis cache settings
- `LOG_*` - Logging configuration
- `RATE_LIMIT_*` - Rate limiting settings
- `CORS_*` - CORS configuration

## Development Guidelines

### Code Structure
```
src/
├── config/          # Configuration files
├── controllers/     # Request handlers
├── middleware/      # Express middleware
├── routes/          # Route definitions
├── services/        # Business logic
├── repositories/    # Data access layer
├── types/           # TypeScript type definitions
└── utils/           # Utility functions
```

### Error Handling
- Use `AppError` class for operational errors
- All routes wrapped with `asyncHandler`
- Comprehensive error logging
- Structured error responses

### Logging
- Use winston logger for all logging
- Structured logging with metadata
- Different log levels for different environments
- Automatic request/response logging

### Security
- JWT authentication with refresh tokens
- Password hashing with bcrypt
- Rate limiting on all endpoints
- CORS configuration
- Input validation with Zod
- SQL injection prevention

## Production Deployment

### Docker Build
```bash
docker build -t finance-practice-backend .
docker run -p 3001:3001 finance-practice-backend
```

### Environment Configuration
- Set secure JWT secrets
- Configure production database
- Enable SSL/TLS
- Set appropriate log levels
- Configure error monitoring

## Contributing

1. Follow TypeScript best practices
2. Write tests for new features
3. Update API documentation
4. Follow conventional commit messages
5. Run linting and type checking before commits

## License
MIT License