# 📚 BookTracker

> A modern full-stack application to track your reading journey — books read, in progress, and on your wishlist. Built as a portfolio project to demonstrate end-to-end software engineering with a strong focus on CI/CD practices.

[![CI](https://github.com/MaeseJoe/book-tracker/actions/workflows/ci.yml/badge.svg)](https://github.com/MaeseJoe/book-tracker/actions)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Java](https://img.shields.io/badge/Java-21-orange.svg)](https://openjdk.org/projects/jdk/21/)
[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-4.1-brightgreen.svg)](https://spring.io/projects/spring-boot)
[![React](https://img.shields.io/badge/React-19-blue.svg)](https://react.dev/)

---

## ✨ Features

### Implemented

- 🔐 JWT authentication — register, login and automatic token refresh
- 📖 Add books and track them across reading statuses (Want to read · Reading · Finished)
- 🔍 Filter your library by reading status
- 🖥️ Full-stack app with React 19 SPA consuming a Spring Boot 4.1 REST API

### Planned

- 📖 Track books across reading statuses (reading, finished, want to read)
- 🔍 Search and import metadata from the OpenLibrary API
- ⭐ Rate books, write reviews, and log reading dates
- 📊 Personal reading statistics with yearly summaries and trends
- 🔐 JWT-based authentication and user accounts
- 📷 Upload custom book covers
- 📤 Export your library to CSV

## 🛠️ Tech Stack

### Backend

- **Java 21** (LTS)
- **Spring Boot 4.1** — REST API on Spring Framework 7
- **Spring Security** with JWT-based auth
- **Spring Data JPA** with Hibernate
- **PostgreSQL 16**
- **Maven** for build & dependency management

### Frontend

- **React 19** + **TypeScript**
- **Vite** as the build tool
- **TanStack Query** for server state
- **React Router** for client-side routing
- **Tailwind CSS v4** for styling

### DevOps & Infrastructure

- **Docker** & **Docker Compose** for local development
- **GitHub Actions** for CI/CD pipelines
- **GitHub Container Registry (GHCR)** for image hosting

## 🏗️ Architecture

``` text
┌──────────────┐      ┌──────────────────┐      ┌──────────────┐
│              │      │                  │      │              │
│   React SPA  │─────▶│  Spring Boot API │─────▶│  PostgreSQL  │
│   (Vite)     │      │      (REST)      │      │              │
│              │      │                  │      │              │
└──────────────┘      └────────┬─────────┘      └──────────────┘
                               │
                               ▼
                      ┌─────────────────┐
                      │   OpenLibrary   │
                      │      API        │
                      └─────────────────┘
```

## 🚀 Getting Started

### Prerequisites

- **Java 21+** ([Eclipse Temurin](https://adoptium.net/) recommended)
- **Node.js 24 LTS** and **pnpm 11** (`npm install -g pnpm`)
- **Docker** & **Docker Compose**
- **Maven 3.9+** (or use the included Maven Wrapper)

### Local Setup

```bash
# 1. Clone the repository
git clone https://github.com/MaeseJoe/book-tracker.git
cd book-tracker

# 2. Start PostgreSQL via Docker Compose
docker compose up -d

# 3. Run the backend
cd backend
./mvnw spring-boot:run

# 4. In a separate terminal, run the frontend
cd frontend
cp .env.example .env.local
pnpm install
pnpm dev
```

Once running, the app is available at:

| Service       | URL                                     |
|---------------|-----------------------------------------|
| Frontend      | <http://localhost:5173>                 |
| Backend API   | <http://localhost:8080>                 |
| Swagger UI    | <http://localhost:8080/swagger-ui.html> |
| PostgreSQL    | localhost:5432                          |

## 📁 Project Structure

``` text
book-tracker/
├── .github/
│   └── workflows/        # GitHub Actions CI/CD pipelines
├── backend/              # Spring Boot REST API
│   ├── src/
│   │   ├── main/
│   │   └── test/
│   ├── pom.xml
│   └── Dockerfile
├── frontend/             # React SPA
│   ├── src/
│   ├── package.json
│   └── Dockerfile
├── docker-compose.yml    # Local development environment
├── .gitignore
└── README.md
```

## 🔄 CI/CD

This project leans heavily on GitHub Actions to automate quality checks, builds and deployments. Every change is validated by the pipeline before reaching `main`.

| Workflow         | Trigger                   | Description                                            |
|------------------|---------------------------|--------------------------------------------------------|
| `ci.yml`         | push / pull_request       | Lint and test both backend and frontend in parallel    |
| `docker.yml`     | push to `main`, tags      | Build & push Docker images to GHCR                     |
| `deploy.yml`     | push to `main`            | Deploy the latest images to the production environment |

See [`.github/workflows/`](.github/workflows/) for the full pipeline definitions.

## 🗺️ Roadmap

- [x] **Phase 1** — MVP: book CRUD with basic UI
- [x] **Phase 2** — JWT authentication and user accounts
- [ ] **Phase 3** — OpenLibrary API integration
- [ ] **Phase 4** — Ratings, reviews and reading dates
- [ ] **Phase 5** — Reading statistics dashboard
- [ ] **Phase 6** — Automated deployment pipeline
- [ ] **Phase 7** — Cover image upload (S3 / Cloudinary)

## 📄 License

Distributed under the MIT License. See [`LICENSE`](LICENSE) for more information.

## 👤 Author

### Joel Reverté

- GitHub: [@MaeseJoe](https://github.com/MaeseJoe)
- LinkedIn: [Joel Reverté](https://linkedin.com/in/joel-reverte)
