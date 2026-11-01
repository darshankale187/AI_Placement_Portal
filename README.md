# PlacementHub: AI-Powered Placement Portal

A full-stack placement portal where recruiters post jobs, students apply with their
resume, and an LLM gives every application a match score with feedback.

> **Disclaimer:** Academic demo project with dummy data only. AI scores are a
> suggestion, the final decision is always the recruiter's.

## Live Demo

- App: https://ai-placement-portal-delta.vercel.app
- Backend: Spring Boot on Render (free tier), MySQL on Aiven
- Note: the backend sleeps when idle, so the first request after a break can take
  up to a minute.
- Create a Student or Recruiter account on the sign-up page. Please use dummy data
  only (resumes are sent to an AI service).

## Screenshots

| Login | Jobs |
|---|---|
| ![Login](screenshots/login.png) | ![Jobs](screenshots/jobs.png) |

| AI match score on apply | Recruiter: applicants |
|---|---|
| ![Apply](screenshots/apply-ai.png) | ![Applicants](screenshots/recruiter.png) |

## Features

- Three roles: **Student**, **Recruiter**, **Admin**, with role-based access
  (URL rules plus an ownership check: a recruiter can only manage their own jobs)
- JWT authentication with BCrypt password hashing
- Students: search jobs, apply once per job with resume text, track status
- Recruiters: post, edit, close and delete jobs, review applicants sorted by match
  score, shortlist, reject or select
- AI match score (Google Gemini) with a short summary and missing skills.
  The final score blends 60% AI and 40% keyword matching, so instructions hidden in
  a resume cannot fully control the score. If the AI is unavailable, the keyword
  score is used and applying still works.
- React frontend with protected routes per role, Redux Toolkit, Context API, axios
  interceptors, light and dark theme

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React (Vite), React Router, Redux Toolkit, Context API, axios |
| Backend | Java, Spring Boot 4, Spring Data JPA, Spring Security, JWT (jjwt) |
| Database | MySQL 8 |
| AI | Google Gemini API |
| Deployment | Vercel (frontend), Docker on Render (backend), Aiven (MySQL) |

## Architecture

```
React (Router, Redux, Context, axios)
   |  Authorization: Bearer <JWT>
   v
Controller -> Service -> Repository -> MySQL
                |
            AiService -> Gemini API
```

## API Endpoints

| Method | Endpoint | Who |
|---|---|---|
| POST | /api/auth/register, /api/auth/login | Public |
| GET | /api/jobs, /api/jobs/{id} | Any logged-in user |
| GET | /api/jobs/mine | Recruiter, Admin |
| POST, PUT, DELETE | /api/jobs | Recruiter (own jobs), Admin |
| POST | /api/applications | Student |
| GET | /api/applications/my | Student |
| GET | /api/jobs/{id}/applications | Job owner, Admin |
| PUT | /api/applications/{id}/status | Job owner, Admin |

## Project Structure

| Folder | Contents |
|---|---|
| `/` (root) | Spring Boot backend (`src/`, `pom.xml`, `Dockerfile`) |
| `/frontend` | React app |
| `/screenshots` | Images used in this README |

## Run Locally

### Database

```sql
CREATE DATABASE placementdb;
```

### Backend

Set these environment variables (Eclipse: Run Configurations -> Environment):

| Variable | Description |
|---|---|
| DB_PASSWORD | MySQL password |
| JWT_SECRET | Random string, at least 32 characters |
| ADMIN_PASSWORD | Password for the seeded `admin` user |
| GEMINI_API_KEY | Key from https://aistudio.google.com/apikey (optional, keyword score is used without it) |

Run the Spring Boot application. It starts on `http://localhost:8080`.

### Frontend

```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```

Open `http://localhost:5173`.

## Security Notes

- Secrets are read from environment variables, never committed
- Role registration is limited to Student and Recruiter, Admin is seeded
- Demo limitations: JWT stored in `localStorage`, no refresh token, no rate limiting,
  open registration

## Author

Darshan, B.Sc. Computer Science
[LinkedIn](https://www.linkedin.com/in/YOUR_PROFILE) | [GitHub](https://github.com/YOUR_USERNAME)