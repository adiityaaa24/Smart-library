# 📚 Smart Library

A full-stack **Library Management System** built with **React** and **Django REST Framework**. The application provides separate, secure workflows for administrators and students to manage books, authors, categories, issuing records, and student accounts — with JWT-based authentication and role-based authorization.

🔗 **Live Demo:** [frontend-aditya-a6cf.vercel.app](https://frontend-aditya-a6cf.vercel.app)

## Features

### 👨‍💼 Admin

* 🔐 Secure JWT-based admin authentication
* 📊 Admin dashboard with live statistics
* 📚 Add, update, and manage books (with cover images)
* ✍️ Manage authors
* 🏷️ Manage book categories
* 📖 Issue books to students
* 📋 Manage and track issued/returned books
* 👨‍🎓 Manage student accounts (block/activate)
* 🔑 Change admin password

### 👨‍🎓 Student

* 📝 Student registration and secure login
* 📚 Browse available books with live availability
* 📖 View currently issued books
* 🕐 View complete borrowing history
* 👤 View and manage profile
* 🔑 Change password

## Tech Stack

### Frontend

* **React** (Vite)
* **JavaScript**
* **Bootstrap / CSS**
* **Axios**

### Backend

* **Python**
* **Django** & **Django REST Framework**
* **Simple JWT** — token-based authentication
* **django-cors-headers**

### Database & Storage

* **PostgreSQL** (production)
* **Cloudinary** — cloud storage for book cover images

### Deployment

* **Render** — backend hosting
* **Vercel** — frontend hosting

### Other

* **Git & GitHub**
* RESTful API architecture

## Architecture

```text
                    ┌─────────────────────┐
                    │    React Frontend   │
                    │      (Vite)         │
                    └──────────┬──────────┘
                               │
                               │ HTTPS / REST API (JWT Auth)
                               ▼
                    ┌─────────────────────┐
                    │    Django Backend   │
                    │ Django REST Framework│
                    └──────────┬──────────┘
                               │
                  ┌────────────┴────────────┐
                  ▼                          ▼
        ┌─────────────────┐       ┌─────────────────┐
        │   PostgreSQL     │       │    Cloudinary    │
        │    Database      │       │  (Media Storage) │
        └─────────────────┘       └─────────────────┘
```

## Security

* **JWT Authentication** — access & refresh tokens issued on login
* **Role-based Authorization** — separate `IsAdmin` / `IsStudent` permission classes protecting every endpoint
* **Password Hashing** — Django's built-in password hashers, no plaintext storage
* **Environment-based Secrets** — database credentials, API keys, and secret keys managed via environment variables, never hardcoded

## Project Structure

```text
library-management-system/
│
├── backend/
│   ├── backend/
│   │   ├── settings.py
│   │   ├── urls.py
│   │   ├── asgi.py
│   │   └── wsgi.py
│   │
│   ├── libraryapp/
│   │   ├── migrations/
│   │   ├── models.py
│   │   ├── serializers.py
│   │   ├── authentication.py
│   │   ├── permissions.py
│   │   ├── views.py
│   │   └── urls.py
│   │
│   ├── manage.py
│   └── requirements.txt
│
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   ├── api.js
│   │   ├── App.jsx
│   │   └── main.jsx
│   │
│   ├── package.json
│   └── vite.config.js
│
└── .gitignore
```

## Getting Started

### Backend Setup

```bash
cd backend
python -m venv venv
venv\Scripts\activate        # Windows
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

Backend runs at `http://127.0.0.1:8000/`

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Frontend runs at the local URL provided by Vite.

### Environment Variables

Backend expects the following environment variables in production:

SECRET_KEY=
DEBUG=False
DATABASE_URL=
FRONTEND_URL=
ADMIN_USERNAME=
ADMIN_PASSWORD=
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=




## API Overview

The React frontend communicates with the Django backend through a REST API secured with JWT. The backend handles:

* Authentication (student & admin, separately)
* Book, author, and category management
* Book issuing and returns
* Student records and borrowing history
* Public statistics (books/students/categories count)

## Key Concepts Demonstrated

* React component-based architecture & state management
* JWT authentication with custom role-based permission classes
* REST API design with Django REST Framework
* CRUD operations across relational data models
* Cloud storage integration (Cloudinary) for media handling
* PostgreSQL in production with environment-based configuration
* CORS configuration across separately deployed frontend/backend
* Full deployment pipeline (Render + Vercel) with CI-style auto-deploy on push

## Future Improvements

* 🧪 Automated backend tests (unit + integration)
* 🔎 Advanced book search and filtering
* 📊 More detailed analytics on the admin dashboard
* 📧 Email notifications for issued and overdue books
* 📱 Further mobile responsiveness improvements

## Author

**Aditya Raj**

A full-stack project built to practice React frontend development, Django REST API development, secure authentication, cloud deployment, and production debugging.