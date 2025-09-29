# Airways - Complete Travel Booking Platform 🚀

A comprehensive travel booking backend system built with NestJS, providing flight, hotel, car rental, and travel management services with admin panel and role-based authentication.

## 🎯 Features

### 🔐 Authentication & Authorization
- **JWT-based authentication** with secure token management  
- **Role-based access control** (PASSENGER, ADMIN, SUPER_ADMIN)
- **Admin panel** with comprehensive dashboard and user management
- **Password encryption** with bcrypt

### ✈️ Flight Management
- Flight search with filters (departure, arrival, dates, class)
- Multi-class booking support (Economy, Business, First Class)
- Real-time seat availability
- Airport and airline management
- Flight status tracking

### 🏨 Hotel Booking System
- Hotel search by location and dates
- Room management with pricing
- Guest capacity handling
- Special requests support
- Availability checking

### 🚗 Car Rental Service
- Vehicle fleet management (Economy, Luxury, SUV)
- Flexible pickup/return locations
- Daily and weekly rental rates
- Driver license management
- Booking conflict prevention

### 👑 Admin Panel
- **Dashboard** with analytics and statistics
- **User Management** (view, edit roles, activate/deactivate)
- **System Settings** management
- **Audit Logs** and activity monitoring
- **Revenue Tracking** across all services

### 📊 Additional Features
- Tour package management
- Travel insurance options
- Review and rating system
- Notification system
- Payment processing
- Comprehensive API documentation
- **Database**: PostgreSQL with Prisma ORM
- **Testing**: Comprehensive unit and e2e tests with Jest
- **CI/CD**: GitHub Actions workflow for automated testing and deployment
- **Containerization**: Docker support with docker-compose for easy deployment
- **Code Quality**: ESLint, Prettier, and pre-commit hooks

## 🛠 Tech Stack

- **Framework**: NestJS (Node.js)
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Authentication**: JWT (JSON Web Tokens)
- **Documentation**: Swagger/OpenAPI
- **Testing**: Jest
- **Containerization**: Docker & Docker Compose
- **CI/CD**: GitHub Actions
- **Code Quality**: ESLint, Prettier

## 📋 Prerequisites

- Node.js (version 18 or higher)
- PostgreSQL (version 13 or higher)
- npm or yarn package manager

## 🚀 Quick Start

### 1. Clone the repository
```bash
git clone <repository-url>
cd airways-backend
```

### 2. Install dependencies
```bash
npm install
```

### 3. Environment Setup
```bash
cp .env.example .env
```

Edit the `.env` file with your database credentials and other configuration:
```env
DATABASE_URL="postgresql://username:password@localhost:5432/airways_db"
JWT_SECRET="your-super-secret-jwt-key"
JWT_EXPIRATION="7d"
PORT=3001
```

### 4. Database Setup
```bash
# Generate Prisma client
npm run prisma:generate

# Run database migrations
npm run prisma:migrate

# Seed the database with sample data
npm run prisma:seed
```

### 5. Start the application
```bash
# Development mode
npm run start:dev

# Production mode
npm run start:prod
```

The API will be available at `http://localhost:3001`

## 📚 API Documentation

Once the application is running, visit:
- **Swagger UI**: `http://localhost:3001/api/docs`
- **API Base URL**: `http://localhost:3001/api/v1`

## 🐳 Docker Development

### Using Docker Compose
```bash
# Start all services (PostgreSQL + Redis + Backend)
docker-compose up -d

# View logs
docker-compose logs -f airways-backend

# Stop all services
docker-compose down
```

### Building Docker Image
```bash
# Build the image
docker build -t airways-backend .

# Run the container
docker run -p 3001:3001 --env-file .env airways-backend
```

## 🧪 Testing

```bash
# Run unit tests
npm run test

# Run unit tests with coverage
npm run test:cov

# Run e2e tests
npm run test:e2e

# Run tests in watch mode
npm run test:watch
```

## 🗄 Database Management

```bash
# Generate Prisma client
npm run prisma:generate

# Create and apply migration
npm run prisma:migrate

# Deploy migrations (production)
npm run prisma:deploy

# Open Prisma Studio (database GUI)
npm run prisma:studio

# Reset database (development only)
npx prisma migrate reset
```

## 📁 Project Structure

```
src/
├── modules/
│   ├── auth/           # Authentication module
│   ├── users/          # User management
│   ├── flights/        # Flight operations
│   ├── bookings/       # Booking system
│   ├── airports/       # Airport data
│   ├── airlines/       # Airline management
│   └── prisma/         # Database service
├── common/             # Shared utilities
├── main.ts            # Application entry point
└── app.module.ts      # Root application module

prisma/
├── schema.prisma      # Database schema
├── migrations/        # Database migrations
└── seed.ts           # Database seeding

test/                  # E2E tests
```

## 🔧 Available Scripts

- `npm run build` - Build the application
- `npm run start` - Start the application
- `npm run start:dev` - Start in development mode
- `npm run start:prod` - Start in production mode
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier
- `npm run test` - Run unit tests
- `npm run test:e2e` - Run end-to-end tests
- `npm run test:cov` - Run tests with coverage

## 🚀 Deployment

### GitHub Actions CI/CD

The project includes a comprehensive CI/CD pipeline that:
1. Runs tests on multiple Node.js versions
2. Builds the application
3. Deploys to your preferred cloud platform
4. Builds and pushes Docker images

### Environment Variables for Production

Required environment variables for production:
```env
DATABASE_URL=postgresql://user:password@host:port/database
JWT_SECRET=your-production-jwt-secret
NODE_ENV=production
PORT=3001
```

### Cloud Deployment Options

- **Azure App Service**: Configured in GitHub Actions
- **AWS ECS/EC2**: Docker-based deployment
- **Google Cloud Run**: Containerized deployment
- **Heroku**: Simple git-based deployment

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Team

- **Backend Developer**: Your Name
- **Database Designer**: Your Name
- **DevOps Engineer**: Your Name

## 🆘 Support

If you have any questions or run into issues, please:
1. Check the [API documentation](http://localhost:3001/api/docs)
2. Review the [GitHub Issues](https://github.com/your-repo/issues)
3. Contact the development team

---

**Airways Backend API** - Making flight booking simple and reliable! ✈️