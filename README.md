# 📚 BookStore

A **MERN stack BookStore application** where users can register, log in, explore books, add books, manage favourites, and delete them. Built with **MongoDB, Express, React, and Node.js**, secured using JWT authentication.

---

## 🚀 Features
- 🔑 User authentication (Register/Login with JWT)
- 👤 User Dashboard after login
- 📚 Add, View, and Delete Books
- ❤️ Mark books as Favourites
- 🛡️ Secure API routes with JWT verification
- 🎨 Responsive UI with TailwindCSS

---

## 🛠️ Tech Stack
- **Frontend**: React, TailwindCSS
- **Backend**: Node.js, Express.js
- **Database**: MongoDB (Mongoose ODM)
- **Authentication**: JSON Web Token (JWT)

---

BookStore/
│── backend/ # Express + MongoDB code
│ ├── models/ # Mongoose schemas
│ ├── routes/ # API routes
│ ├── conn/ # Database connection
│ └── app.js # Main server file
│
│── frontend/ # React app
│ ├── src/
│ │ ├── components/ # Reusable UI components
│ │ ├── pages/ # AllBooks, Favourites, Login, Register
│ │ ├── App.jsx
│ │ └── index.jsx
│ └── README.md



---

## ⚙️ Installation  

### 1. Clone the repository
```bash
git clone https://github.com/your-username/BookStore.git
cd BookStore


2. Install dependencies
Backend
cd backend
npm install


Frontend
cd frontend
npm install

Setup Environment Variables

Create a .env file in the backend folder:

PORT=5000

MONGO_URI=your_mongodb_connection_string

JWT_SECRET=your_secret_key


▶️ Run the Project
Start Backend
cd backend
npm run dev

Start Frontend
cd frontend
npm start

