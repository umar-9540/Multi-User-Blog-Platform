# Multi-User Blog Platform
A full-stack modern blogging platform built with the MERN stack (MongoDB, Express, React/Next.js, Node.js). It features role-based authentication, a rich text editor, image uploads via Cloudinary, and a dedicated Admin Dashboard.

## Features
* Authentication: Secure JWT-based login/signup with password hashing (Bcrypt).

- Role-Based Access Control (RBAC):

-- Admin: Manage all users, delete any post, view analytics.

Author: Create, edit, and manage their own posts.

- Content Management:

- Create, Edit, Delete (Soft Delete) posts.

- Rich Text / Markdown support.

- Image uploads (Cloudinary).

Engagement: Comment system with moderation tools.

Performance: Server-side rendering (SSR) via Next.js for SEO.

Tech Stack
Frontend: Next.js (App Router), Tailwind CSS

Backend: Node.js, Express.js

Database: MongoDB (Mongoose)

Authentication: JWT, Bcrypt.js

Storage: Cloudinary (Image Hosting)

Installation & Setup
Follow these steps to run the project locally.

1. Clone the Repository
2. Backend Setup
Navigate to the server folder and install dependencies:

Create a .env file in the server/ directory:

Start the backend server:

3. Frontend Setup
Open a new terminal, navigate to the client folder, and install dependencies:

Create a .env.local file in the client/ directory:

Start the frontend application:

🔑 Default Admin Credentials
To access the Admin Dashboard immediately, you can use these credentials
email: admin@example.com
password: admin123
