# KanboardAPI

## Overview

This project implements a Kanban Board API for managing tasks, boards, and user authentication. It allows users to create, update, and delete boards and tasks, manage task categories, and authenticate using Google OAuth.

## Getting Started

To get started with this project, follow these steps:

1. Clone the repository:
    git clone https://github.com/username/kanban-board-api.git
2. Navigate to the project directory:
    cd kanban-board-api
3. Install dependencies:
    npm install
4. Set up environment variables:
    - Create a .env file.
    - Configure environment variables:
        - GOOGLE_CLIENT_ID
        - GOOGLE_CLIENT_SECRET
        - REDIRECT_URI
        - JWT_SECRET
        - MONGO_URI
        - REDIS_CLOUD_USERNAME 
        - REDIS_CLOUD_PASSWORD
        - REDIS_CLOUD_HOST
        - REDIS_CLOUD_PORT
        - PORT
        - CLIENT_URL
5. Start the application:
    npm start
6. The server will start running on http://localhost:9000 by default.

## API Endpoints
 
### Authentication:
- GET /auth/google: Initiate Google Sign-In flow.
- GET /auth/google/callback: Callback route after successful authentication.
- GET /auth/profile: Get user profile.
- GET /auth/logout: Handle user sign-out.

### Board Management:
- GET /api/boards: Get all boards.
- POST /api/boards: Create a new board.
- GET /api/boards/:boardId: Get a specific board.
- PUT /api/boards/:boardId: Update a board.
- POST /api/boards/:boardId/invite: Invite user to a board.

### Task Management:
- GET /api/boards/:boardId/tasks: Get all tasks in a board.
- POST /api/boards/:boardId/tasks: Create a new task in a board.
- GET /api/boards/:boardId/tasks/:taskId: Get a specific task in a board.
- PUT /api/boards/:boardId/tasks/:taskId: Update a task in a board.
- DELETE /api/boards/:boardId/tasks/:taskId: Delete a task in a board.

## Technologies Used

- Node.js (server)
    - Express.js
    - Authentication using JWTs
    - Rate Limiting
- MongoDB (Persistent Storage)
    - Mongoose
- Google OAuth
- External API for Avatar Generation (e.g., DiceBear)
- Redis (Caching)
- AWS EC2 (Deployment)
- GitHub
    - CI/CD using GitHub Actions
- Postman (Documentation of APIs)

## Developed by

- Mohammed Faisal Hussain
