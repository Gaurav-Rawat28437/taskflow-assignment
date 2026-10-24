# TaskFlow – Task Management App

TaskFlow is a full-stack task management application built with the MERN stack. It allows users to create an account, log in securely, create tasks, manage task status, and organize their daily work.

## Features

- **User Authentication** – Sign up and log in with email or username and password.
- **Secure Passwords** – Passwords are hashed using bcrypt.
- **Cookie-Based Authentication** – JWT authentication using HTTP-only cookies.
- **Create Tasks** – Add tasks with a title and optional description.
- **View All Tasks** – View your tasks in one place.
- **Update Tasks** – Edit task details and update task status.
- **Delete Tasks** – Remove tasks you no longer need.
- **Task Status** – Organize tasks as pending or completed.
- **User-Specific Tasks** – Each user can manage their own tasks.

## Tech Stack

**Frontend**
- React.js
- Vite
- Tailwind CSS
- React Router
- Axios

**Backend**
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT
- bcrypt
- Cookie Parser
- Validator

## Project Structure

```text
TaskFlow/
├── backend/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── server.js
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── .env
│   └── package.json
│
├── .gitignore
└── README.md
```

*Note: Adjust the folder names above if your actual project structure is different.*

## Installation and Setup

### 1. Clone the repository

```bash
git clone https://github.com/YOUR_USERNAME/taskflow-task-manager.git
cd taskflow-task-manager
```

### 2. Set up the backend

```bash
cd backend
npm install
```

Create a `.env` file inside the backend folder:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
NODE_ENV=development
```

Replace the example values with your own configuration.

Start the backend server using the script configured in your `package.json`, for example:

```bash
npm run dev
```

### 3. Set up the frontend

Open another terminal:

```bash
cd frontend
npm install
```

Create a `.env` file inside the frontend folder:

```env
VITE_API_URL=http://localhost:5000/api
```

Start the frontend:

```bash
npm run dev
```

Open the local URL provided by Vite in your browser.

## API Endpoints

### Authentication

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/sign-up` | Register a new user |
| POST | `/api/auth/login` | Log in a user |
| POST | `/api/auth/logout` | Log out a user |
| GET | `/api/auth/get-user-data` | Get the current user's data |

### Tasks

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/tasks` | Create a task |
| GET | `/api/tasks` | Get the logged-in user's tasks |
| PUT | `/api/tasks/:id` | Update a task |
| DELETE | `/api/tasks/:id` | Delete a task |

Protected endpoints require valid authentication.

## Environment Variables

**Backend**

| Variable | Description |
|---|---|
| `PORT` | Backend server port |
| `MONGO_URI` | MongoDB connection string |
| `JWT_SECRET` | Secret used to sign JWTs |
| `NODE_ENV` | Application environment |

**Frontend**

| Variable | Description |
|---|---|
| `VITE_API_URL` | Backend API base URL |

Never commit `.env` files or expose database credentials and JWT secrets.

## Future Improvements

- Search and filter tasks
- Task deadlines and reminders
- Pagination
- User profile management
- Dashboard with task statistics
- Deploy the frontend and backend

## Author

**Gaurav Rawat**

MERN Stack Developer

---

If you find this project useful, feel free to ⭐ the repository.
