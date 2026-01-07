# Setup & Installation Guide

This document explains how to **set up and run the PR Review System locally and in Docker**, using **Node.js**, **Redis**, and the **Gemini API key**.

It is written so that a new developer can go from **zero → running system** with minimal friction.

---

## 1. Prerequisites

Before starting, ensure you have the following installed:

* **Node.js** ≥ 18.x
* **npm** or **pnpm**
* **Docker** ≥ 24.x
* **Docker Compose** ≥ 2.x
* A **GitHub App** (for webhooks)
* A **Google Gemini API Key**

---

## 2. Environment Variables

Create a `.env` file at the root of the project:

```env
# GitHub App
GITHUB_APP_ID=
GITHUB_PRIVATE_KEY=
WEBHOOK_SECRET=

# Redis (Upstash or Local)
REDIS_URL=

# Gemini AI
GEMINI_API_KEY=

# Worker
WORKER_CONCURRENCY=5

# Server
PORT=3000
NODE_ENV=development
```

> ⚠️ Never commit `.env` files to version control.

---

## 3. Local Setup (Node.js Only)

### 3.1 Install Dependencies

```bash
npm install
```

---

### 3.2 Start Redis (Local)

If you are not using Upstash, start Redis locally:

```bash
docker run -p 6379:6379 redis:7
```

Update `REDIS_URL` accordingly:

```env
REDIS_URL=redis://localhost:6379
```

---

### 3.3 Run the API Server

```bash
npm run dev
```

The API server will start on:

```
http://localhost:3000
```

---

### 3.4 Run the Worker Process

In a separate terminal:

```bash
node dist/worker/worker.js
```

This process will listen to the queue and process PR review jobs.

---

## 4. Docker Setup (Recommended)

Docker allows you to run the **API + Worker + Redis** consistently across environments.

---

### 4.1 Dockerfile (Node.js)

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install --production

COPY . .

RUN npm run build

CMD ["node", "dist/index.js"]
```

---

### 4.2 Worker Dockerfile

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install --production

COPY . .

RUN npm run build

CMD ["node", "dist/worker/worker.js"]
```

---

### 4.3 docker-compose.yml

```yaml
version: "3.9"

services:
  api:
    build: .
    container_name: pr-api
    env_file:
      - .env
    ports:
      - "3000:3000"
    depends_on:
      - redis

  worker:
    build: .
    container_name: pr-worker
    command: node dist/worker/worker.js
    env_file:
      - .env
    depends_on:
      - redis

  redis:
    image: redis:7
    container_name: pr-redis
    ports:
      - "6379:6379"
```

---

### 4.4 Start the System

```bash
docker compose up --build
```

Services started:

* API → `http://localhost:3000`
* Worker → background job processor
* Redis → queue backend

---

## 5. GitHub Webhook Configuration

1. Create a **GitHub App**
2. Subscribe to `pull_request` events
3. Set webhook URL:

```
http://<your-domain>/webhooks/github
```

4. Copy the webhook secret into `WEBHOOK_SECRET`

---

## 6. Gemini API Setup

1. Go to **Google AI Studio**
2. Create a Gemini API key
3. Add it to `.env`:

```env
GEMINI_API_KEY=your_api_key_here
```

The worker will automatically use Gemini for PR analysis.

---

## 7. Verification Checklist

* [ ] API server starts without errors
* [ ] Worker connects to Redis
* [ ] Queue shows jobs in `wait` state
* [ ] Worker processes jobs
* [ ] PR comments appear on GitHub

---

## 8. Common Issues

### Worker not picking jobs

* Check `REDIS_URL`
* Ensure worker is running
* Verify queue name matches

### Webhook not triggering

* Check webhook secret
* Inspect GitHub webhook delivery logs

### Gemini errors

* Validate API key
* Check quota limits

---

## 9. Summary

This setup supports:

* Local development
* Docker-based deployment
* Easy transition to cloud hosting

For architecture details, refer to `docs/architecture.md`.

---

**Author:** Adarsh
