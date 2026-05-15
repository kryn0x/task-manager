# Team Task Manager

A full-stack Team Task Manager web application built with React, Node.js, Express, MySQL, and Sequelize.

## Features

- **Authentication** — JWT-based login/signup with bcrypt password hashing
- **Role-Based Access Control** — Admin and Member roles with different permissions
- **Project Management** — Create, edit, delete, and view projects (Admin only)
- **Task Management** — Full CRUD for tasks with status/priority tracking
- **Dashboard Analytics** — Role-specific dashboards with stats and recent tasks
- **Responsive UI** — Clean, modern design with Tailwind CSS

## Tech Stack

| Layer      | Technology                          |
|------------|-------------------------------------|
| Frontend   | React 18, Vite, Tailwind CSS, Axios |
| Backend    | Node.js, Express.js                 |
| Database   | MySQL, Sequelize ORM                |
| Auth       | JWT, bcryptjs                       |
| Deployment | Railway (backend), Vercel (frontend)|

---

## Project Structure

```
assesment/
├── backend/
│   ├── config/          # Database config
│   ├── controllers/     # Route handlers
│   ├── middleware/      # Auth, error, validation middleware
│   ├── models/          # Sequelize models
│   ├── routes/          # Express routes
│   ├── utils/           # JWT helpers, seed script
│   ├── validators/      # express-validator rules
│   ├── .env.example
│   └── server.js
└── frontend/
    └── src/
        ├── api/         # Axios instance
        ├── components/  # Reusable UI components
        ├── context/     # Auth context
        ├── layouts/     # App layout
        ├── pages/       # Page components
        ├── routes/      # Route guards
        ├── services/    # API service functions
        └── utils/       # Helper functions
```

---

## Getting Started

### Prerequisites

- Node.js 18+
- MySQL 8+

### 1. Database Setup

Create a MySQL database:

```sql
CREATE DATABASE team_task_manager;
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Copy and configure environment variables:

```bash
copy .env.example .env
```

Edit `.env`:

```env
PORT=5000
NODE_ENV=development
DB_HOST=localhost
DB_PORT=3306
DB_NAME=team_task_manager
DB_USER=root
DB_PASSWORD=yourpassword
JWT_SECRET=your_super_secret_jwt_key_here
JWT_EXPIRES_IN=7d
FRONTEND_URL=http://localhost:5173
```

Start the backend:

```bash
npm run dev
```

### 3. Seed Demo Data (Optional)

```bash
npm run seed
```

This creates demo users and sample data:

| Role   | Email               | Password   |
|--------|---------------------|------------|
| Admin  | admin@example.com   | admin123   |
| Member | alice@example.com   | member123  |
| Member | bob@example.com     | member123  |
| Member | carol@example.com   | member123  |

### 4. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

---

## API Reference

### Auth
| Method | Endpoint            | Access  | Description        |
|--------|---------------------|---------|--------------------|
| POST   | /api/auth/signup    | Public  | Register user      |
| POST   | /api/auth/login     | Public  | Login              |
| GET    | /api/auth/profile   | Auth    | Get own profile    |
| GET    | /api/auth/users     | Admin   | List all users     |

### Projects
| Method | Endpoint            | Access  | Description        |
|--------|---------------------|---------|--------------------|
| GET    | /api/projects       | Auth    | List all projects  |
| GET    | /api/projects/:id   | Auth    | Get project        |
| POST   | /api/projects       | Admin   | Create project     |
| PUT    | /api/projects/:id   | Admin   | Update project     |
| DELETE | /api/projects/:id   | Admin   | Delete project     |

### Tasks
| Method | Endpoint                | Access       | Description        |
|--------|-------------------------|--------------|--------------------|
| GET    | /api/tasks              | Auth         | List tasks         |
| GET    | /api/tasks/:id          | Auth         | Get task           |
| POST   | /api/tasks              | Admin        | Create task        |
| PUT    | /api/tasks/:id          | Admin        | Update task        |
| DELETE | /api/tasks/:id          | Admin        | Delete task        |
| PATCH  | /api/tasks/:id/status   | Auth         | Update status      |

### Dashboard
| Method | Endpoint                | Access  | Description           |
|--------|-------------------------|---------|-----------------------|
| GET    | /api/dashboard/admin    | Admin   | Admin analytics       |
| GET    | /api/dashboard/member   | Auth    | Member analytics      |

---

## Deployment

### Backend → Railway

1. Push backend to a GitHub repo
2. Create a new Railway project and connect the repo
3. Add a MySQL plugin in Railway
4. Set environment variables in Railway dashboard
5. Railway auto-deploys on push

### Frontend → Vercel

1. Push frontend to a GitHub repo
2. Import project in Vercel
3. Set `VITE_API_URL` to your Railway backend URL (e.g. `https://your-app.railway.app/api`)
4. Vercel auto-deploys on push

---

## Role Permissions

| Feature              | Admin | Member |
|----------------------|-------|--------|
| View dashboard       | ✅    | ✅     |
| Create projects      | ✅    | ❌     |
| Edit/delete projects | ✅    | ❌     |
| Create tasks         | ✅    | ❌     |
| Assign tasks         | ✅    | ❌     |
| Edit/delete tasks    | ✅    | ❌     |
| View all tasks       | ✅    | ❌     |
| View own tasks       | ✅    | ✅     |
| Update task status   | ✅    | ✅     |
