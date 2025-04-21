# Backend API (Node.js + TypeScript)

## 📦 Features
- User authentication with JWT
- Role-based access control
- Admin-only user management (CRUD)
- Transaction system with types, subtypes, filters, pagination
- Revenue breakdown (monthly & weekly) for charting
- MongoDB integration via Mongoose
- TypeScript support

## 🚀 Getting Started

### 1. Install dependencies
```bash
  npm install
```

### 2. Create `.env`
#### Default .env example
```env
MONGO_URI=mongodb://localhost:27017/your_db
JWT_SECRET=supersecurekey
PORT=5000
```

### 3. Run the server
```bash
  npm run dev       # development (nodemon + ts-node)
  npm run build     # build TypeScript
  npm start         # run compiled version
```

## 🧪 Seed the Database
To populate initial data (roles, admin/user, test transactions):
```bash
  npm run seed
```

This will create:
- Roles: `admin`, `user`
- Users:
    - **Admin**: `admin@example.com` / `adminPassword123`
    - **User**: `user@example.com` / `userPassword123`
- Transactions for the standard user (reward, purchase, refund)

## 🐳 Docker

### Dockerfile (production build)
```bash
  docker-compose -f docker-compose.yml up --build
```

### Dockerfile.dev (with hot reload)
```bash
  docker-compose up --build
```

## 📁 Project Structure
```
src/
├── models/            # Mongoose schemas
├── routes/            # API route handlers
├── middleware/        # Auth middleware
└── index.ts           # Entry point
scripts/
└── seed.ts            # DB seeding
```