# KanboardAPI

## Overview

Welcome to KanboardAPI, a powerful API for managing Kanban boards, tasks, and user authentication. This project provides robust functionalities to streamline your project management process, enabling users to effortlessly create, update, and delete boards and tasks, as well as manage task categories. With seamless integration of Google OAuth authentication, users can securely authenticate and access the API, ensuring a smooth and secure experience. Let's unlock the full potential of Kanban board management together!

## Getting Started

To get started with this project, follow these steps:

1. Clone the repository:
    ```bash
    git clone https://github.com/faisal7008/KanboardAPI.git
    ```

2. Navigate to the project directory:
    ```bash
    cd KanboardAPI
    ```

3. Install dependencies:
    ```bash
    npm install
    ```

4. Set up environment variables:
    - Create a `.env` file.
    - Configure environment variables:
        - `GOOGLE_CLIENT_ID`
        - `GOOGLE_CLIENT_SECRET`
        - `REDIRECT_URI`
        - `JWT_SECRET`
        - `MONGO_URI`
        - `REDIS_CLOUD_USERNAME` 
        - `REDIS_CLOUD_PASSWORD`
        - `REDIS_CLOUD_HOST`
        - `REDIS_CLOUD_PORT`
        - `PORT`
        - `CLIENT_URL`

5. Start the application:
    ```bash
    npm start
    ```

6. The server will start running on `http://localhost:9000` by default.


## To login with Google:

1. Go to http://localhost:9000/auth/google and sign in with your Google account.
2. After successfully logging in, you will be redirected back to the application.
3. You will be provided with an authorization bearer token, which you can use for authentication purposes in your requests.

## API Endpoints

### Authentication:
- **GET /auth/google:** Initiates the Google Sign-In flow.
- **GET /auth/google/callback:** Callback route after successful Google authentication.
- **GET /auth/profile:** Retrieves the user profile. (Requires authentication token)
- **GET /auth/logout:** Handles user sign-out. (Requires authentication token)

### Board Management:
- **GET /api/boards:** Retrieves all boards. (Requires authentication token)
- **POST /api/boards:** Creates a new board. (Requires authentication token)
- **GET /api/boards/:boardId:** Retrieves a specific board. (Requires authentication token)
- **PUT /api/boards/:boardId:** Updates a board. (Requires authentication token)
- **POST /api/boards/:boardId/invite:** Invites a user to a board. (Requires authentication token)

### Task Management:
- **GET /api/boards/:boardId/tasks:** Retrieves all tasks in a board. (Requires authentication token)
- **POST /api/boards/:boardId/tasks:** Creates a new task in a board. (Requires authentication token)
- **GET /api/boards/:boardId/tasks/:taskId:** Retrieves a specific task in a board. (Requires authentication token)
- **PUT /api/boards/:boardId/tasks/:taskId:** Updates a task in a board. (Requires authentication token)
- **DELETE /api/boards/:boardId/tasks/:taskId:** Deletes a task in a board. (Requires authentication token)

## Technologies Used

- **Node.js** (server)
    - Express.js
    - Authentication using JWTs
    - Rate Limiting
- **MongoDB** (Persistent Storage)
    - Mongoose
- **Google OAuth**
- External API for Avatar Generation (e.g., DiceBear)
- **Redis** (Caching)
- **AWS EC2** (Deployment)
- **GitHub**
    - CI/CD using GitHub Actions
- **Postman** (Documentation of APIs)

## Deployment

The site is hosted on AWS EC2 and can be accessed at [Kanboard API](https://kanboard-api.duckdns.org).

## Developed by

- Mohammed Faisal Hussain
