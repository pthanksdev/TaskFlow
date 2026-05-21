# TaskFlow - Full Stack Kanban Application

TaskFlow is a modern, premium Kanban board and task management application. It features a Next.js (React) frontend styled with Tailwind CSS and Shadcn UI, and a Java Spring Boot backend powered by a PostgreSQL database.

## 🚀 Local Development (Docker)

The easiest way to run the entire application locally is using Docker Compose.

### Prerequisites
- [Docker](https://docs.docker.com/get-docker/)
- [Docker Compose](https://docs.docker.com/compose/install/)

### Steps
1. Navigate to the root directory of the project.
2. Run the following command to build and start the containers:
   ```bash
   docker-compose up --build
   ```
3. Open your browser and navigate to `http://localhost:3000`. The frontend will automatically communicate with the backend on `http://localhost:8080`.

To stop the application, press `Ctrl+C` and run:
```bash
docker-compose down
```

*(Note: If you ever need to reset the database schema, run `docker-compose down -v` to wipe the volumes).*

---

## ☁️ Deployment Guide

This guide explains how to deploy the **Spring Boot Backend & PostgreSQL Database to Render** and the **Next.js Frontend to Vercel**.

### Part 1: Deploying the Backend & Database to Render

Render is an excellent platform for hosting Docker containers and managed PostgreSQL databases.

#### 1. Setup PostgreSQL on Render
1. Create a free account at [render.com](https://render.com).
2. Click **New +** and select **PostgreSQL**.
3. Name your database (e.g., `taskflow-db`), choose a region, and click **Create Database**.
4. Once created, copy the **Internal Database URL** (e.g., `postgres://user:pass@host/db`). You will need this for the backend.

#### 2. Deploy Spring Boot Backend (Docker)
1. Push your local project code to a new GitHub repository.
2. In Render, click **New +** and select **Web Service**.
3. Connect your GitHub repository.
4. Render needs to know which folder the backend is in. Configure the deployment settings:
   - **Name**: `taskflow-backend`
   - **Environment**: `Docker`
   - **Root Directory**: `backend`
5. **Environment Variables**: Add the following variables so your backend knows how to connect to the production database:
   - `SPRING_DATASOURCE_URL`: Replace the `postgres://` prefix of your Internal URL with `jdbc:postgresql://`. (e.g., `jdbc:postgresql://<RENDER_HOST>/<DB_NAME>?sslmode=require`)
   - `SPRING_DATASOURCE_USERNAME`: `<YOUR_RENDER_DB_USERNAME>`
   - `SPRING_DATASOURCE_PASSWORD`: `<YOUR_RENDER_DB_PASSWORD>`
   - `SPRING_JPA_HIBERNATE_DDL_AUTO`: `update`
6. Click **Create Web Service**. Render will automatically read the `Dockerfile` inside the `backend` folder, build the Java image, and deploy it.
7. Once deployed, copy your **backend's live URL** (e.g., `https://taskflow-backend.onrender.com`).

---

### Part 2: Deploying the Frontend to Vercel

*Note: While we use a Docker container for the frontend locally, Vercel natively hosts Next.js applications serverlessly without Docker. This is the industry standard because it is significantly faster, scales automatically, and is usually free.*

#### 1. Deploy Next.js
1. Create a free account at [vercel.com](https://vercel.com).
2. Click **Add New...** -> **Project**.
3. Import the same GitHub repository you used for the backend.
4. Configure the project to build the frontend folder:
   - **Framework Preset**: Next.js
   - **Root Directory**: `frontend`
5. **Environment Variables**: You must tell the frontend where your new Render backend lives so it doesn't try to fetch from `localhost`. Expand the environment variables section and add:
   - `NEXT_PUBLIC_API_URL`: `<YOUR_RENDER_BACKEND_URL>` (e.g., `https://taskflow-backend.onrender.com`)
6. Click **Deploy**.

Vercel will build your Next.js application and provide you with a live, production-ready URL!

---

### Alternative: Hosting Frontend via Docker on Render (Optional)
If you specifically want to host the frontend using its `Dockerfile` instead of Vercel, you can deploy it to Render just like the backend:
1. In Render, create a new **Web Service**.
2. Connect your repo and set the **Root Directory** to `frontend`.
3. Set the **Environment** to `Docker`.
4. Add the `NEXT_PUBLIC_API_URL` environment variable pointing to your backend URL.
5. Click **Create Web Service**. Render will build the Next.js Docker image and host it.
# TaskFlow
