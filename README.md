# Task Management API

This is a RESTful API for managing tasks in a task management system. The API is built using Node.js, Express, TypeScript, Firebase Firestore for data storage, and Docker for containerization.

## Features

- User authentication with JWT (JSON Web Tokens)
- Role-based access control (User/Admin roles)
- CRUD operations for tasks
  - Create, Read, Update, and Delete tasks
- User account management (Admin only)
  - Toggle user account status (Active/Inactive)
  - Delete user accounts
- Task status management (e.g., Todo, In-progress, Done)
- Real-time Firestore integration

## Technologies Used

- Node.js
- Express
- TypeScript
- Firebase Firestore
- JWT for authentication
- Docker for containerization

## Prerequisites

Before running the application, make sure you have the following installed:

- [Node.js](https://nodejs.org/) (v18 or higher)
- [Docker](https://www.docker.com/)

- `Create a firebase application and download the project service account private key`

- Add the file in the base directory of the application

- Edit the `firebase.ts` file in the services folder as below

```typescript
import admin, { ServiceAccount } from 'firebase-admin';
import serviceAccount from '.path/to/serviceAccountKey.json';

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount as ServiceAccount),
});

const firestore = admin.firestore();
export { admin, firestore };
```

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/kofnet002/tms-express-js.git
cd tms-express-js
```

### 2. Create a `.env` file

```bash
PORT=3000
JWT_SECRET=your_jwt_secret_here
```

### 3. Build and run the Docker container

```bash
docker build -t task-api .
docker run --env-file .env -p 3000:3000 task-api
```

`The API will be accessible at http://localhost:3000.`

### 4. Running Locally without Docker

- Install dependencies:

```bash
npm install
```

- Build the TypeScript files:

```bash
npm run build
```

- Run the application:

```bash
npm start
```

`The API will be accessible at http://localhost:3000.`

## API Endpoints

### Authentication

- POST `/api/v1/auth/login` - Login a user and receive a JWT token.
- POST `/api/v1/auth/register` - Register a new user.

### Tasks

- GET `/api/v1/tasks` - Get all tasks (Admin) or user-specific tasks.
- GET `/api/v1/tasks/:taskId` - Get a specific task by ID (Admin) or user-specific tasks.
- POST `/api/v1/tasks` - Create a new task (Admin) or user-specific tasks.
- PUT `/api/v1/tasks/:taskId` - Update a task by ID (Admin) or user-specific tasks.
- DELETE `/api/v1/tasks/:taskId` - Delete a task by ID (Admin) or user-specific tasks.

### Users

- GET `/api/v1/users` - Get all users (Admin only).
- GET `/api/v1/user/:userId` - Get a specific user by ID.
- DELETE `/api/v1/users/:userId` - Delete a user account (Admin only).
- PUT `/api/v1/user/:userId/toggle-status'` - Toggle a user status (Admin only).
- PUT `/api/v1/user/:userId/toggle-role'` - Toggle a user role (Admin only).

## Security

- JWT Authentication: Ensures that only authenticated users can access protected routes.

- Role-Based Access Control: Admin users have special privileges, such as managing all users and tasks.

## Contributions 💁🏼

Contributions are welcome! If you'd like to contribute to the project, please open a pull request with your changes, or submit issues for feature requests or bug reports.
I love receiving pull requests from the community! If you have an improvement or a new feature you'd like to add, please feel free to do so 👍

## Reporting Issues 🚩

If you encounter any bugs or issues, please report them using the <a href="https://github.com/kofnet002/tms-express-js/issues">Issues</a> section of my GitHub repository. When reporting issues, please include:

A clear and descriptive title.
A detailed description of the problem, including steps to reproduce it.
Any relevant logs or error messages. Your environment details (e.g., + Django version, DRF version, database, etc.).
