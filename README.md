# VN Food Library

A comprehensive full-stack web application for managing Vietnamese food recipes, meal scheduling, and building personalized food collections. This platform enables users to explore a rich library of Vietnamese dishes, plan their meals, and contribute new recipes to the community with an admin approval system.

## Features

- User Authentication & Authorization
  - JWT-based authentication with refresh token rotation
  - Secure password hashing with bcryptjs
  - Protected routes and API endpoints
  
- Food Library Management
  - Complete food database with nutritional information
  - Search and filter foods by category, ingredients, cuisine
  - Like and recommendation system
  
- Meal Planning & Scheduling
  - Monthly calendar view with meal planning
  - Create and manage daily meal schedules
  - Track meals by type (breakfast, lunch, dinner, snacks)
  
- Collections System
  - Create custom food collections
  - Add/remove dishes from collections
  - Public and private collection settings
  - Share collections with community
  
- Contribution System
  - Submit new food recipes to the library
  - Suggest edits to existing foods
  - Admin approval workflow
  - Activity tracking and audit logs
  
- Notifications
  - Real-time notifications for users
  - Admin broadcast messaging
  - Mark notifications as read
  - Notification history
  
- Admin Dashboard
  - System statistics and analytics
  - Contribution approval panel
  - User management
  - Activity monitoring
  - Admin notifications system

## Tech Stack

Frontend
- React 19 with TypeScript
- Redux Toolkit with RTK Query for state management
- React Router v6 for routing
- Tailwind CSS for styling
- Vite as build tool

Backend
- Node.js v24 with Express.js
- TypeScript with ES modules
- MongoDB for database
- Mongoose for ODM
- JWT for authentication

## Architecture

The project follows a feature-based modular architecture to ensure scalability and maintainability.

Frontend Structure:
```
client/src/
├── features/
│   ├── auth/          (Authentication slices and API)
│   ├── collections/   (Collections API and components)
│   ├── foods/         (Foods API endpoints)
│   ├── meals/         (Meal scheduling features)
│   ├── users/         (User profile management)
│   ├── notifications/ (Notifications system)
│   ├── admin/         (Admin dashboard features)
│   └── contributions/ (Contribution workflow)
├── pages/             (Page components)
├── components/        (Shared UI components)
├── app/               (Redux store configuration)
└── shared/            (Utilities and helpers)
```

Backend Structure:
```
server/src/
├── features/
│   ├── auth/          (Authentication routes and controllers)
│   ├── users/         (User management)
│   ├── collections/   (Collections business logic)
│   ├── foods/         (Food library)
│   ├── meals/         (Meal scheduling)
│   ├── notifications/ (Notification system)
│   ├── activities/    (Audit logging)
│   └── contributions/ (Contribution management)
├── middleware/        (Express middleware)
├── utils/             (Helper functions)
└── config/            (Database and app setup)
```

## Demo

Homepage showcasing the Vietnamese food library

![Homepage](images/homepage.png)

Food library with search and filtering capabilities

![Food Library](images/library.png)

## Installation & Setup

### Prerequisites

- Node.js v18+ and npm/yarn
- MongoDB Atlas account (or local MongoDB)
- Git for version control

### Backend Setup

```bash
cd server
npm install

cp .env.example .env.local
```

Edit `.env.local` with your configuration:
```
PORT=5000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/dbname
JWT_ACCESS_SECRET=your-secret-key
JWT_REFRESH_SECRET=your-refresh-key
ACCESS_TOKEN_EXPIRE=15m
REFRESH_TOKEN_EXPIRE=7d
NODE_ENV=development
CLIENT_URL=http://localhost:5173
```

Start the backend server:
```bash
npm run dev
```

Backend will run on http://localhost:5000

### Frontend Setup

```bash
cd client
npm install

cp .env.example .env.local
```

Edit `.env.local`:
```
VITE_API_BASE_URL=http://localhost:5000/api
VITE_APP_NAME=VN Food Library
```

Start the frontend development server:
```bash
npm run dev
```

Frontend will run on http://localhost:5173

### Running Both Services

Terminal 1 - Start Backend:
```bash
cd server && npm run dev
```

Terminal 2 - Start Frontend:
```bash
cd client && npm run dev
```

Open http://localhost:5173 in your browser to access the application.

## Development Commands

Backend:
```bash
npm run dev      # Start development server
npm run build    # Build for production
npm start        # Run production build
npm test         # Run tests
```

Frontend:
```bash
npm run dev      # Start development server with HMR
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Run ESLint
```

## Project Structure

```
vnfoodlibrary/
├── client/              # React + TypeScript frontend
│   ├── src/
│   │   ├── features/
│   │   ├── pages/
│   │   ├── components/
│   │   └── app/
│   ├── package.json
│   └── vite.config.ts
├── server/              # Node.js + Express backend
│   ├── src/
│   │   ├── features/
│   │   ├── middleware/
│   │   ├── utils/
│   │   └── config/
│   ├── package.json
│   └── tsconfig.json
├── .gitignore
└── README.md
```

## Database Schema

User collections include meal schedules, personal food collections, contributions, and notifications. All data is properly indexed and includes timestamps for tracking creation and modifications.

## Troubleshooting

**Frontend cannot connect to backend**
- Ensure backend is running on localhost:5000
- Check VITE_API_BASE_URL in .env.local
- Verify CORS settings in server/src/server.ts

**MongoDB connection fails**
- Confirm IP whitelist on MongoDB Atlas includes your IP
- Verify connection string in .env.local
- Check network connectivity

**Port conflicts**
```bash
# Find process using port 5173
lsof -i :5173
kill -9 <PID>

# Find process using port 5000
lsof -i :5000
kill -9 <PID>
```

## Contributing

1. Fork the repository
2. Create a feature branch: git checkout -b feature/your-feature
3. Commit changes: git commit -m "feat: your feature description"
4. Push to branch: git push origin feature/your-feature
5. Open a pull request

## License

MIT

## Author

Your Name

---

Last Updated: April 1, 2026
