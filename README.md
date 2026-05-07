# CourseSphere

CourseSphere is a full-stack web application for managing courses and lessons, built with Ruby on Rails (API) and React (Vite + Tailwind CSS).

## Prerequisites
- Docker and Docker Compose

## Quick Start
1. Clone the repository.
2. Run `docker compose up --build` from the root directory.
3. The backend API will be available at `http://localhost:3000`.
4. The frontend will be available at `http://localhost:5173`.
5. Run migrations: `docker compose run --rm backend rails db:migrate`

## Features
- **Authentication**: JWT-based secure authentication.
- **Course Management**: Create, read, and search courses.
- **Lessons**: Manage lessons within courses with status tracking.
- **External Integration**: Automatically fetches random guest instructor details for courses using the RandomUser API.

## Tech Stack
- **Backend**: Ruby on Rails 8, PostgreSQL, JWT (Authentication)
- **Frontend**: React 19, Vite, Tailwind CSS v4, React Router
- **Infra**: Docker Compose
