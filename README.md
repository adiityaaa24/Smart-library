# Library Management System 📚

A full-stack **Library Management System** built with **React** and **Django REST Framework**. The application provides separate workflows for administrators and students to manage books, authors, categories, issuing records, and student accounts.

## Features

### 👨‍💼 Admin

* 🔐 Admin authentication
* 📊 Admin dashboard
* 📚 Add, update, and manage books
* ✍️ Manage authors
* 🏷️ Manage book categories
* 📖 Issue books to students
* 📋 Manage issued books
* 👨‍🎓 Manage student accounts
* 🔑 Change admin password

### 👨‍🎓 Student

* 📝 Student registration and login
* 📚 Browse available books
* 📖 View issued books
* 🕐 View borrowing history
* 👤 View and manage profile
* 🔑 Change password

## Tech Stack

### Frontend

* **React**
* **JavaScript**
* **Vite**
* **CSS**

### Backend

* **Python**
* **Django**
* **Django REST Framework**
* **django-cors-headers**

### Database

* **SQLite** for local development

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
                               │ HTTP / REST API
                               ▼
                    ┌─────────────────────┐
                    │    Django Backend   │
                    │ Django REST Framework│
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │       SQLite        │
                    │      Database       │
                    └─────────────────────┘
```

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
│   │   ├── views.py
│   │   └── urls.py
│   │
│   ├── manage.py
│   └── requirements.txt
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
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

Navigate to the backend directory:

```bash
cd backend
```

Create a virtual environment:

```bash
python -m venv venv
```

Activate it on Windows:

```powershell
venv\Scripts\activate
```

Install the required dependencies:

```bash
pip install -r requirements.txt
```

Run database migrations:

```bash
python manage.py migrate
```

Start the Django development server:

```bash
python manage.py runserver
```

The backend will run at:

```text
http://127.0.0.1:8000/
```

### Frontend Setup

Open another terminal and navigate to the frontend:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Start the Vite development server:

```bash
npm run dev
```

The frontend will be available at the local URL provided by Vite.

## API

The React frontend communicates with the Django backend through REST APIs.

The backend handles operations such as:

* User authentication
* Book management
* Author management
* Category management
* Book issuing
* Student records
* Borrowing history

## Key Concepts

This project demonstrates practical implementation of:

* React component-based architecture
* React state management
* REST API integration
* Django REST Framework
* CRUD operations
* Authentication workflows
* Relational data modelling
* API request handling
* Frontend/backend separation
* CORS configuration
* Git-based project management

## Future Improvements

* ☁️ Deploy frontend and backend
* 🐘 Migrate production database from SQLite to PostgreSQL
* 🔐 Implement token-based authentication
* 📱 Improve mobile responsiveness
* 🔎 Add advanced book search and filtering
* 📊 Add detailed analytics to the admin dashboard
* 📧 Add email notifications for issued and overdue books
* 🖼️ Improve image/media storage for production

## Author

**Aditya Raj**

A full-stack project built to practice React frontend development, Django REST API development, database operations, and frontend-backend integration.
