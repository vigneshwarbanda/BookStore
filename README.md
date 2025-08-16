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

## 📸 Preview
<img width="602" height="511" alt="BookStore Preview" src="https://github.com/user-attachments/assets/dcfa9c1c-1acb-47f2-9623-55c2c0c1e81f" />

---

## ⚙️ Installation  

### 1️⃣ Clone the repository
```bash
git clone https://github.com/your-username/BookStore.git
cd BookStore

###2️⃣ Install dependencies
```bash
####Backend
cd backend
npm install

####Frontend
cd frontend
npm install

###3️⃣ Setup Environment Variables
####Create a .env file inside the backend folder and add:
```bash
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key

###4️⃣ Run the Project
####Start Backend
nodemon app.js

#### Start Frontend
npm run dev 


