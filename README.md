# MovieHub - Movie Reviews Web Application

A full-stack movie review platform built with **Next.js**, **TypeScript**, **PostgreSQL**, and **NextAuth.js**.

The application allows users to browse movies, submit ratings and reviews, and manage their own content. Moderators have elevated permissions enabling movie and review management through role-based authorization.

The project demonstrates practical experience with:

- Full-stack web development
- Authentication and authorization
- REST API design
- Server-Side Rendering (SSR)
- Relational database design
- PostgreSQL integration
- Secure session management
- Role-Based Access Control (RBAC)

---

## Application Preview

### Movie Catalog

The main page presents the movie collection available in the system. Users can browse available titles, view ratings, and access detailed movie information.

<img width="1435" height="734" alt="Zrzut ekranu 2026-06-05 210306" src="https://github.com/user-attachments/assets/2b57ce99-e479-4cd1-83e0-5fff452ab644" />

---

### Movie Details & Reviews

Detailed movie page displaying movie information, average ratings, and user reviews. This view represents the core functionality of the application and allows authenticated users to interact with movie content.

<img width="1435" height="762" alt="Zrzut ekranu 2026-06-05 210349" src="https://github.com/user-attachments/assets/a0a89e25-1faa-462c-802e-0eda00b09ff0" />

---

### Edit Review

Authenticated users can edit reviews they previously created. Ownership verification ensures that users may only modify their own content.

<img width="715" height="619" alt="Zrzut ekranu 2026-06-05 210108" src="https://github.com/user-attachments/assets/49a4a8c3-ccad-40f1-895c-2eca89fa1f90" />

---

### Movie Management (Moderator)

Users with moderator privileges can edit movie information, including descriptions and metadata. This functionality demonstrates role-based authorization and content management capabilities.

<img width="1450" height="788" alt="Zrzut ekranu 2026-06-05 205630" src="https://github.com/user-attachments/assets/a47ca752-eec4-4c3b-9895-4dbdbc79d7bd" />

---

### Review Moderation

Moderators can manage all reviews in the system regardless of ownership. Administrative actions include editing and deleting user-generated content when necessary.

<img width="774" height="319" alt="Zrzut ekranu 2026-06-05 210157" src="https://github.com/user-attachments/assets/573b0d17-bf87-4913-b80b-5a794a05610b" />

---

# Features

## User Features

### Authentication

- User registration
- Secure login
- Session management using NextAuth.js
- Logout functionality

### Movie Reviews

- Add reviews
- Rate movies
- Edit own reviews
- Delete own reviews
- View average ratings

### Movie Browsing

- Browse movie catalog
- View movie details
- Read community reviews

---

## Moderator Features

Moderators inherit all user permissions and additionally can:

- Edit movie information
- Delete movies
- Edit any review
- Delete any review
- Moderate user-generated content

---

# Authentication & Authorization

Authentication is implemented using **NextAuth.js**.

Security mechanisms include:

- Session-based authentication
- Protected routes
- Backend authorization checks
- Role-based permissions
- User ownership verification

Authorization rules:

| Action | User | Moderator |
|----------|----------|----------|
| Add review | ✅ | ✅ |
| Edit own review | ✅ | ✅ |
| Delete own review | ✅ | ✅ |
| Edit any review | ❌ | ✅ |
| Delete any review | ❌ | ✅ |
| Edit movie | ❌ | ✅ |
| Delete movie | ❌ | ✅ |

---

# System Architecture

```text
Browser
   │
   ▼
Next.js Frontend
   │
   ▼
Next.js API Routes
   │
   ▼
PostgreSQL Database
```

The application follows a full-stack architecture where both frontend rendering and backend API logic are implemented within the Next.js framework.

---

# Database Design

The application uses a relational PostgreSQL database.

## Entity Relationship Diagram

<img width="935" height="693" alt="image" src="https://github.com/user-attachments/assets/dc5ea097-4303-42c8-b20f-c806b8badd6c" />

---

## Main Tables

### users

Stores registered users and role information.

### movies

Stores movie metadata.

### reviews

Stores movie ratings and user review content.

Relationships:

```text
users (1) ──────── (N) reviews

movies (1) ─────── (N) reviews
```

---

# Technology Stack

## Frontend

- Next.js
- React
- TypeScript
- CSS

## Backend

- Next.js API Routes
- Node.js

## Authentication

- NextAuth.js

## Database

- PostgreSQL

## Security

- Session-based authentication
- Authorization middleware
- Input validation
- Parameterized SQL queries

---

# Project Structure

```text
moviehub/
│
├── pages/
│   ├── api/
│   │   ├── auth/
│   │   ├── movies/
│   │   └── reviews/
│   │
│   └── index.tsx
│
├── components/
│   └── AuthBar.tsx
│
├── lib/
│   └── db.js
│
├── README.md
└── package.json
```

---

# Installation

## Requirements

- Node.js
- PostgreSQL
- npm

---

## Clone Repository

```bash
git clone https://github.com/waldemarwilk-a11y/moviehub.git
```

---

## Install Dependencies

```bash
npm install
```

---

## Configure Environment Variables

Create:

```env
.env.local
```

Configure:

```env
DATABASE_URL=

NEXTAUTH_SECRET=

NEXTAUTH_URL=
```

---

## Start Development Server

```bash
npm run dev
```

Application:

```text
http://localhost:3000
```

---

# Learning Outcomes

This project provided practical experience with:

- Full-stack application development
- Next.js ecosystem
- TypeScript development
- PostgreSQL integration
- Authentication systems
- Authorization mechanisms
- REST API development
- Database modeling
- Server-side rendering
- Secure web application design

---

# Future Improvements

Potential enhancements:

- Search and filtering
- Movie categories
- User profiles
- Pagination
- Image uploads
- OpenAPI documentation
- Docker containerization
- CI/CD pipeline
- Unit and integration tests

---

# Author

**Waldemar Wilk**

Computer Science Engineering Student

Portfolio project demonstrating modern full-stack web development using Next.js, TypeScript, PostgreSQL, authentication, authorization, and relational database design.
