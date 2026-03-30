# VN Food Library - Monorepo

A full-stack web application for managing Vietnamese food library, recipes, and meal scheduling.

## Project Structure

```
vnfoodlibrary/
├── client/              # React + TypeScript + Vite frontend
│   ├── src/
│   ├── package.json
│   ├── .env.example
│   └── README.md
├── server/              # Node.js + Express + MongoDB backend
│   ├── src/
│   ├── package.json
│   ├── .env.example
│   └── README.md
├── .gitignore
├── README.md
└── .env.example
```

## Quick Start

### Prerequisites

- Node.js v18+ and npm/yarn
- MongoDB Atlas account (or local MongoDB)

### 1. Setup Backend

```bash
cd server
npm install

# Create .env from .env.example
cp .env.example .env.local
# Edit .env.local with your MongoDB URI and secrets

npm run dev
```

Backend runs on http://localhost:5000

### 2. Setup Frontend

```bash
cd client
npm install

# Create .env from .env.example
cp .env.example .env.local
# (Default API_URL points to http://localhost:5000/api)

npm run dev
```

Frontend runs on http://localhost:5173

## Environment Variables

### Backend (.env.local)

```
PORT=5000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/dbname
JWT_ACCESS_SECRET=your-secret-key
JWT_REFRESH_SECRET=your-secret-key
ACCESS_TOKEN_EXPIRE=15m
REFRESH_TOKEN_EXPIRE=7d
NODE_ENV=development
CLIENT_URL=http://localhost:5173
```

### Frontend (.env.local)

```
VITE_API_BASE_URL=http://localhost:5000/api
VITE_APP_NAME=VN Food Library
```

## Technologies

### Frontend

- React 19.2.0
- TypeScript
- Vite 7.3.1
- Redux Toolkit + RTK Query
- React Router v6
- Tailwind CSS
- React Hook Form + Zod

### Backend

- Node.js v24
- Express.js v5
- TypeScript with ESM
- MongoDB + Mongoose
- JWT Authentication
- bcryptjs for password hashing

## Git Workflow

### First Time Setup

```bash
# Initialize git
git init

# Add all files
git add .

# Create initial commit
git commit -m "chore: initial commit - VN Food Library monorepo"

# Add remote repository
git remote add origin https://github.com/yourusername/vnfoodlibrary.git

# Push to main branch
git push -u origin main
```

### Folder-Specific Commits

```bash
# Backend changes
git add server/
git commit -m "feat(server): add user profile update endpoint"

# Frontend changes
git add client/
git commit -m "feat(client): create profile edit page"

# Both
git add .
git commit -m "feat: integrate user profile management"
```

## Development

### Running Both Services

Terminal 1 - Backend:
```bash
cd server
npm run dev
```

Terminal 2 - Frontend:
```bash
cd client
npm run dev
```

### Code Structure

Backend (server/src/):
- features/ - Feature modules (auth, users, meals, collections)
- middleware/ - Express middleware (auth, validation, error)
- utils/ - Utility functions (JWT, error handling)
- config/ - Database and app configuration

Frontend (client/src/):
- features/ - Redux slices and RTK Query API endpoints
- pages/ - Page components (Home, Login, Profile)
- components/ - Reusable UI components
- app/ - Store and Router configuration

## Features Implemented

- User authentication (register, login, JWT refresh)
- User profile management (edit info, change password)
- Protected routes with redirect
- Responsive design with Tailwind CSS
- Form validation with Zod
- Type-safe API calls with RTK Query
- Dynamic navbar based on auth state

## Commit Convention

```
feat(scope): description        # New feature
fix(scope): description         # Bug fix
chore(scope): description       # Maintenance/configuration
docs(scope): description        # Documentation
refactor(scope): description    # Code refactoring
```

Scopes: client, server, api, auth, profile, db, etc.

Examples:
```
feat(auth): implement JWT refresh token rotation
fix(client): fix profile form validation error messages
docs(server): add API documentation in README
```

## Contributing

1. Create feature branch: git checkout -b feature/your-feature
2. Commit changes with proper messages
3. Push branch: git push origin feature/your-feature
4. Create Pull Request

## Common Tasks

### Rebuild Frontend After Dependencies Change

```bash
cd client
rm -rf dist node_modules
npm install
npm run build
```

### Reset Backend To Fresh State

```bash
cd server
rm -rf dist node_modules .env.local
npm install
cp .env.example .env.local
# Edit .env.local with your config
npm run dev
```

### Generate New JWT Secrets

```bash
node -e "console.log('Access:', require('crypto').randomBytes(32).toString('hex')); console.log('Refresh:', require('crypto').randomBytes(32).toString('hex'))"
```

## Troubleshooting

### Frontend can't connect to API

- Check backend is running on localhost:5000
- Verify VITE_API_BASE_URL in .env.local
- Check CORS settings in server/src/server.ts

### MongoDB connection error

- Verify IP whitelist on MongoDB Atlas
- Check connection string in .env.local
- Ensure network connectivity

### Port already in use

```bash
# Frontend (port 5173)
lsof -i :5173
kill -9 <PID>

# Backend (port 5000)
lsof -i :5000
kill -9 <PID>
```

## Resources

- React Documentation: https://react.dev
- Express.js Guide: https://expressjs.com
- MongoDB Documentation: https://docs.mongodb.com
- Vite Documentation: https://vitejs.dev
- Redux Toolkit: https://redux-toolkit.js.org

## License

MIT

## Author

Your Name

---

Last Updated: March 30, 2026
