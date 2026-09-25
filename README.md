# JobBoard Platform

A full-stack job board application connecting employers and candidates — built with Django REST Framework and React.

Employers can post jobs, manage listings, and review applicants. Candidates can search jobs, save jobs for later, upload resumes, apply, and track their application status. Both roles get real-time notifications and a dashboard with live stats.

## Features

- **Authentication** — JWT-based auth with separate employer/candidate roles, automatic token refresh
- **Job Postings** — Employers can create, edit, and manage job listings, including opening/closing hiring
- **Job Search** — Public search with keyword, location, and job type filters, plus sorting
- **Saved Jobs** — Candidates can bookmark jobs to revisit later
- **Resume Upload** — Candidates upload and manage multiple resumes
- **Applications** — Apply to jobs, track status (Applied → Reviewed → Shortlisted → Rejected/Hired), with a filterable applications list
- **Notifications** — Automatic notifications when a candidate applies or an employer updates application status, plus a live notification bell
- **Profile Management** — Editable profiles for both employers (company info, industry, size) and candidates (skills, gender, date of birth, resumes)
- **Dashboard** — Role-specific home page with real application/job statistics and recent activity
- **Dark Mode** — App-wide light/dark theme toggle, available in the navbar and Settings
- **Admin Panel** — Full Django admin for user and data management

## Tech Stack

**Backend**
- Django + Django REST Framework
- PostgreSQL
- JWT authentication (`djangorestframework-simplejwt`)
- `django-filter` for search/filtering
- `django-cors-headers` for frontend integration

**Frontend**
- React (Vite)
- React Router
- Axios (with automatic token-refresh interceptor)
- `lucide-react` for icons

## Project Structure

```
JobBoard Platform/
├── JobBoard/                  # Django backend
│   ├── config/                 # Project settings, root URLs
│   ├── users/                  # Custom User model, auth, profiles
│   ├── jobs/                   # Job listings, saved jobs
│   ├── applications/           # Resumes, applications, stats
│   ├── notifications/          # Notifications
│   └── manage.py
└── frontend/                   # React frontend
    ├── src/
    │   ├── api/                 # Axios client config (with token refresh)
    │   ├── context/             # Auth context, Theme (dark mode) context
    │   ├── hooks/                # Custom hooks (e.g. saved jobs)
    │   ├── components/          # Navbar, Sidebar, route guards, modals, etc.
    │   └── pages/                # All page components
    └── package.json
```

## Setup

### Prerequisites
- Python 3.12+
- Node.js + npm
- PostgreSQL

### Backend

```bash
cd JobBoard
python -m venv venv
venv\Scripts\Activate.ps1      # Windows PowerShell
pip install -r requirements.txt
```

Create a PostgreSQL database, then create a `.env` file inside `JobBoard/`:

```
DEBUG=True
SECRET_KEY=your-secret-key
DB_NAME=jobboard_db
DB_USER=postgres
DB_PASSWORD=your-password
DB_HOST=localhost
DB_PORT=5432
```

Then run:

```bash
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver
```

Backend runs at `http://127.0.0.1:8000`

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend runs at `http://localhost:5173`

## API Overview

| Endpoint | Method | Description |
|---|---|---|
| `/api/auth/login/` | POST | Login, returns JWT tokens |
| `/api/auth/login/refresh/` | POST | Refresh an expired access token |
| `/api/users/register/employer/` | POST | Register as employer |
| `/api/users/register/candidate/` | POST | Register as candidate |
| `/api/users/me/` | GET | Current user info |
| `/api/users/me/profile/` | GET/PATCH | View/update profile |
| `/api/jobs/` | GET/POST | List (with search/filter) or create a job |
| `/api/jobs/<id>/` | GET/PATCH/DELETE | View/edit/delete a job |
| `/api/jobs/mine/` | GET | Employer's own job postings |
| `/api/jobs/stats/` | GET | Public platform stats |
| `/api/jobs/saved/` | GET/POST | List or save a job (candidate) |
| `/api/jobs/saved/<job_id>/` | DELETE | Unsave a job |
| `/api/applications/resumes/` | GET/POST | List/upload resumes |
| `/api/applications/apply/` | POST | Apply to a job |
| `/api/applications/mine/` | GET | Candidate's own applications |
| `/api/applications/job/<job_id>/` | GET | Employer: applicants for a job |
| `/api/applications/<id>/status/` | PATCH | Employer: update application status |
| `/api/applications/stats/` | GET | User-specific stats |
| `/api/applications/recent/` | GET | Employer: 5 most recent applicants |
| `/api/notifications/` | GET | List notifications |
| `/api/notifications/<id>/read/` | PATCH | Mark notification as read |

## Roles

- **Employer** — post jobs, edit listings, open/close hiring, view applicants, update application status, edit company profile
- **Candidate** — browse/search jobs, save jobs, upload resumes, apply, track applications, edit profile

## License

This project was built as part of a backend development internship task.