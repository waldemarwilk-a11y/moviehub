Movie Reviews Web Application

Project Description

This project is a full-stack web application for managing movies and user reviews.
It allows registered users to browse movies, add ratings and reviews, and manage their own content.
Moderators have additional permissions to edit and delete movies and reviews.

The application was developed as an educational project demonstrating practical knowledge of:
- full-stack web development
- relational databases
- authentication and authorization
- REST API design
- server-side rendering



<img width="935" height="693" alt="image" src="https://github.com/user-attachments/assets/dc5ea097-4303-42c8-b20f-c806b8badd6c" />




Features

User:
- User registration and authentication
- Secure login and logout
- Adding movie reviews (rating and comment)
- Editing and deleting own reviews
- Viewing average movie ratings

Moderator:
- All user features
- Editing movie details
- Deleting movies
- Editing and deleting any review

General:
- Server-side rendering (SSR)
- REST API architecture
- Role-based access control
- Relational database with foreign keys


Technology Stack

Frontend:
- Next.js (React)
- TypeScript
- Server-side rendering (getServerSideProps)

Backend:
- Next.js API Routes
- NextAuth.js
- Node.js

Database:
- PostgreSQL
- Relational database
- Foreign key constraints


Database Schema

The database consists of three relational tables:
- users
- movies
- reviews

Relationships:
- One user can create many reviews
- One movie can have many reviews

users (1) -> (N) reviews
movies (1) -> (N) reviews


Project Structure

/pages
  /api
    /auth
    /movies
    /reviews
  /movies
    [id]
/lib
  db.ts
/public
/styles


Authentication and Authorization

Authentication is implemented using NextAuth.js with session-based authorization.

Rules:
- Only authenticated users can add reviews
- Users can edit and delete only their own reviews
- Moderators can edit and delete any review
- Moderators can edit and delete movies
- Authorization is enforced on both frontend and backend


API Endpoints

Reviews:
- POST /api/reviews
- PUT /api/reviews/{id}
- DELETE /api/reviews/{id}

Movies:
- PUT /api/movies/{id} (moderator only)
- DELETE /api/movies/{id} (moderator only)


Installation and Setup

Requirements:
- Node.js
- PostgreSQL
- npm

Steps:
1. Clone the repository:
   git clone https://github.com/your-username/moviehub.git

2. Install dependencies:
   npm install

3. Configure environment variables:
   - database connection
   - NextAuth configuration

4. Run the development server:
   npm run dev

5. Open in browser:
   http://localhost:3000


Security

- Session-based authentication
- Role-based authorization
- Input validation
- Parameterized SQL queries
- OWASP security guidelines applied


Purpose of the Project

This project was created for academic purposes.
It demonstrates practical implementation of a full-stack web application using modern technologies,
a relational database, and secure authentication mechanisms.

The repository is intended for academic evaluation and exchange programs such as Erasmus.


Author

Project developed by:
Waldemar Wilk



