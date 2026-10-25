# XChat

A full-stack real-time chat application built using React, Node.js, Express, MongoDB, and Firebase Realtime Database.

- **Live Frontend**: https://xchat-sigma-mauve.vercel.app
- **Live Backend**: https://xchat-backend-kpob.onrender.com

## Features

- User authentication with JWT and bcrypt password hashing
- Live search for registered users
- Private 1-on-1 chat rooms
- Real-time messaging and typing status via Firebase Realtime Database
- Responsive UI matching custom mockups

## Tech Stack

- **Frontend**: React (Vite), React Router, Axios, Firebase SDK
- **Backend**: Node.js, Express, MongoDB, Mongoose, JWT, bcryptjs, cookie-parser, CORS
- **Hosting**: Vercel (Client), Render (API), MongoDB Atlas, Firebase

## Local Development

### Prerequisites

- Node.js (v18+)
- MongoDB running locally or Atlas URI
- Firebase Realtime Database credentials

### Server Setup

```bash
cd server
npm install
```

Create a `.env` file inside `server/`:

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/xchat
JWT_SECRET=your_secret_key
```

Run the server:

```bash
npm start
```

### Client Setup

```bash
cd client
npm install
```

Create a `.env` file inside `client/`:

```env
VITE_API_URL=http://localhost:5000/api
VITE_FIREBASE_API_KEY=your_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_DATABASE_URL=https://your_project-default-rtdb.firebasedatabase.app
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

Run the frontend:

```bash
npm start
```

The application will be available at `http://localhost:3000`.
