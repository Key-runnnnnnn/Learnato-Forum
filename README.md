# 🎓 Learnato Discussion Forum Microservice

> A full-stack discussion forum platform with real-time updates, AI-powered features, and Firebase authentication.

---

## 🔐 Demo Credentials

### **Quick Test Access:**

**Demo Account 1:**

- **Email:** `demo@learnato.com`
- **Password:** `Demo@123456`

**Demo Account 2:**

- **Email:** `testuser@learnato.com`
- **Password:** `Test@123456`

**Google OAuth:** You can also sign in with any Google account using the "Sign in with Google" button.

> **Note:** If demo accounts don't exist yet, you can create a new account using the sign-up form with any email and password (minimum 6 characters).

---

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Prerequisites](#-prerequisites)
- [Quick Start](#-quick-start)
- [Environment Setup](#-environment-setup)
- [Running the Application](#-running-the-application)
- [Docker Deployment](#-docker-deployment)
- [API Documentation](#-api-documentation)
- [Project Structure](#-project-structure)
- [Troubleshooting](#-troubleshooting)

---

## ✨ Features

### 🎯 Core Features

- ✅ **User Authentication** - Firebase Auth (Email/Password & Google OAuth)
- ✅ **Create & Manage Posts** - Create questions with title and content
- ✅ **Reply System** - Add replies to any post
- ✅ **Vote System** - Upvote/downvote posts with toggle functionality
- ✅ **Real-time Updates** - Socket.io for live post/reply/vote updates
- ✅ **Mark as Answered** - Mark questions as resolved

### 🤖 AI-Powered Features

- ✅ **Similar Questions** - AI suggests related questions using Gemini
- ✅ **AI Reply Suggestions** - Smart reply recommendations
- ✅ **Discussion Summaries** - AI-generated conversation summaries

### 🎨 UI/UX Features

- ✅ **Responsive Design** - Tailwind CSS for modern UI
- ✅ **Filter & Sort** - By votes, date, answered status
- ✅ **Search** - Find posts by keywords
- ✅ **Authentication Guards** - Protected routes and actions

---

## 🛠️ Tech Stack

### Frontend

- **React 19** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **React Router DOM** - Routing
- **Axios** - HTTP client
- **Socket.io Client** - Real-time communication
- **Firebase** - Authentication
- **React Icons** - Icon library

### Backend

- **Node.js** - Runtime
- **Express** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **Socket.io** - Real-time communication
- **Google Generative AI (Gemini)** - AI features

### DevOps

- **Docker** - Containerization
- **Docker Compose** - Multi-container orchestration
- **Nginx** - Frontend web server (in Docker)

---

## 📦 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher) - [Download](https://nodejs.org/)
- **npm** (comes with Node.js)
- **MongoDB Atlas Account** (or local MongoDB) - [Sign up](https://www.mongodb.com/cloud/atlas)
- **Firebase Account** - [Sign up](https://firebase.google.com/)
- **Google Gemini API Key** - [Get API Key](https://makersuite.google.com/app/apikey)
- **Git** - [Download](https://git-scm.com/)

**Optional (for Docker deployment):**

- **Docker Desktop** - [Download](https://www.docker.com/products/docker-desktop/)

---

## 🚀 Quick Start

### 1️⃣ Clone the Repository

```bash
git clone <repository-url>
cd Learnato-Forum
```

### 2️⃣ Setup Backend

```bash
cd backend

# Install dependencies
npm install

# Create .env file

# Edit .env with your credentials
nano .env
```

**Required Backend Environment Variables:**

```env
PORT=5000
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/Discussion-Forum-Microservice
FRONTEND_URL=http://localhost:5173
GEMINI_API_KEY=your_gemini_api_key_here
NODE_ENV=development
```

### 3️⃣ Setup Frontend

```bash
cd ../frontend

# Install dependencies
npm install

# Create .env file

# Edit .env with your credentials
nano .env
```

**Required Frontend Environment Variables:**

```env
VITE_API_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000

VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id

VITE_GEMINI_API_KEY=your_gemini_api_key
```

### 4️⃣ Run the Application

**Terminal 1 - Backend:**

```bash
cd backend
npm start
```

**Terminal 2 - Frontend:**

```bash
cd frontend
npm run dev
```

### 5️⃣ Access the Application

- **Frontend:** http://localhost:5173
- **Backend API:** http://localhost:5000/api

---

## 🔧 Environment Setup

### Getting API Keys

#### 1. MongoDB Atlas Connection String

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a cluster (free tier available)
3. Click **"Connect"** → **"Connect your application"**
4. Copy the connection string
5. Replace `<password>` with your database user password
6. Replace `<dbname>` with your database name (e.g., `Discussion-Forum-Microservice`)

**Example:**

```
mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/Discussion-Forum-Microservice?retryWrites=true&w=majority
```

#### 2. Firebase Configuration

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project or select existing
3. Go to **Project Settings** (gear icon) → **General**
4. Scroll to **"Your apps"** section
5. Click **Web** icon (</>) to add a web app
6. Copy all config values to your `.env` file

**Enable Authentication:**

1. Go to **Build** → **Authentication** → **Sign-in method**
2. Enable **Email/Password**
3. Enable **Google**

#### 3. Google Gemini API Key

1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Click **"Create API Key"**
3. Copy the API key
4. Add to both backend and frontend `.env` files

---

## 🏃 Running the Application

### Development Mode (Local)

**Option 1: Using npm scripts**

```bash
# Backend (Terminal 1)
cd backend
npm start

# Frontend (Terminal 2)
cd frontend
npm run dev
```

**Option 2: Using nodemon for backend auto-restart**

```bash
# Backend (Terminal 1)
cd backend
npm install -g nodemon
nodemon index.js

# Frontend (Terminal 2)
cd frontend
npm run dev
```

### Production Mode (Without Docker)

**Backend:**

```bash
cd backend
NODE_ENV=production npm start
```

**Frontend:**

```bash
cd frontend
npm run build
npm run preview
```

---

## 🐳 Docker Deployment

### Prerequisites

- Docker Desktop installed and running

### Setup

1. **Create root .env file:**

```bash
nano .env
```

2. **Add your credentials:**

```env
# MongoDB
MONGO_INITDB_ROOT_USERNAME=admin
MONGO_INITDB_ROOT_PASSWORD=your_secure_password

# API Keys
GEMINI_API_KEY=your_gemini_api_key
VITE_GEMINI_API_KEY=your_gemini_api_key

# Firebase
VITE_FIREBASE_API_KEY=your_firebase_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

3. **Build and run:**

```bash
docker-compose up -d --build
```

4. **Access the application:**

- Frontend: http://localhost
- Backend API: http://localhost:5000/api

5. **View logs:**

```bash
docker-compose logs -f
```

6. **Stop containers:**

```bash
docker-compose down
```

For detailed Docker documentation, see [README_DOCKER.md](README_DOCKER.md)

---

## 📡 API Documentation

### Base URL

```
http://localhost:5000/api
```

### Endpoints

#### Posts

| Method | Endpoint                 | Description           | Auth Required |
| ------ | ------------------------ | --------------------- | ------------- |
| GET    | `/posts`                 | Get all posts         | No            |
| GET    | `/posts/:id`             | Get post by ID        | No            |
| POST   | `/posts`                 | Create new post       | Yes           |
| POST   | `/posts/:id/reply`       | Add reply to post     | Yes           |
| POST   | `/posts/:id/upvote`      | Upvote a post         | Yes           |
| POST   | `/posts/:id/downvote`    | Downvote a post       | Yes           |
| PATCH  | `/posts/:id/answer`      | Mark post as answered | No            |
| GET    | `/posts/search/:keyword` | Search posts          | No            |

#### Query Parameters

**GET /posts:**

- `sortBy` - Sort by: `votes`, `date`, `oldest`, `replies` (default: `votes`)
- `filterAnswered` - Filter by: `all`, `answered`, `unanswered` (default: `all`)

**Example:**

```bash
GET /posts?sortBy=votes&filterAnswered=unanswered
```

#### Request/Response Examples

**Create Post:**

```bash
POST /api/posts
Content-Type: application/json

{
  "title": "How to use React Hooks?",
  "content": "I'm learning React and confused about hooks...",
  "author": "John Doe",
  "userId": "firebase_user_id"
}
```

**Add Reply:**

```bash
POST /api/posts/:id/reply
Content-Type: application/json

{
  "content": "You can use useState for state management...",
  "author": "Jane Smith",
  "userId": "firebase_user_id"
}
```

**Upvote Post:**

```bash
POST /api/posts/:id/upvote
Content-Type: application/json

{
  "userId": "firebase_user_id"
}
```

---

## 📁 Project Structure

```
Hackathon/
├── backend/                      # Backend application
│   ├── config/
│   │   └── database.js          # MongoDB connection
│   ├── controllers/
│   │   └── postController.js    # Post business logic
│   ├── middlewares/
│   │   └── errorHandler.js      # Error handling
│   ├── models/
│   │   ├── Post.js              # Post schema
│   │   └── Reply.js             # Reply schema
│   ├── routes/
│   │   └── postRoutes.js        # API routes
│   ├── .env                     # Environment variables (create from .env.example)
│   ├── .env.example             # Environment variables template
│   ├── .gitignore               # Git ignore rules
│   ├── Dockerfile               # Docker configuration
│   ├── index.js                 # Entry point
│   └── package.json             # Dependencies
│
├── frontend/                     # Frontend application
│   ├── public/
│   ├── src/
│   │   ├── components/          # React components
│   │   │   ├── AISuggestions.tsx
│   │   │   ├── DiscussionSummary.tsx
│   │   │   ├── LoginModal.tsx
│   │   │   ├── Navbar.tsx
│   │   │   ├── PostCard.tsx
│   │   │   ├── PostList.tsx
│   │   │   ├── ReplyForm.tsx
│   │   │   ├── ReplyList.tsx
│   │   │   └── SimilarQuestions.tsx
│   │   ├── context/
│   │   │   └── AuthContext.tsx   # Authentication context
│   │   ├── pages/
│   │   │   ├── CreatePostPage.tsx
│   │   │   ├── HomePage.tsx
│   │   │   └── PostDetailPage.tsx
│   │   ├── services/
│   │   │   ├── api.ts            # API client
│   │   │   ├── firebase.ts       # Firebase config
│   │   │   ├── gemini.ts         # Gemini AI integration
│   │   │   └── socket.ts         # Socket.io client
│   │   ├── types/
│   │   │   └── index.ts          # TypeScript types
│   │   ├── App.tsx               # Main component
│   │   ├── main.tsx              # Entry point
│   │   └── index.css             # Global styles
│   ├── .env                      # Environment variables (create from .env.example)
│   ├── .env.example              # Environment variables template
│   ├── .gitignore                # Git ignore rules
│   ├── Dockerfile                # Docker configuration
│   ├── nginx.conf                # Nginx config for Docker
│   ├── index.html                # HTML template
│   ├── package.json              # Dependencies
│   ├── tsconfig.json             # TypeScript config
│   └── vite.config.ts            # Vite config
│
├── .dockerignore                 # Docker ignore rules
├── docker-compose.yml            # Docker Compose configuration
└── README.md                     # This file
```

---

## 🧪 Testing the Application

### Manual Testing Checklist

#### Authentication

- [ ] Sign up with email/password
- [ ] Sign in with email/password
- [ ] Sign in with Google
- [ ] Sign out
- [ ] Try accessing protected routes without authentication

#### Posts

- [ ] Create a new post
- [ ] View all posts
- [ ] View single post
- [ ] Search for posts
- [ ] Filter by answered/unanswered
- [ ] Sort by votes/date/replies

#### Replies

- [ ] Add reply to a post
- [ ] View all replies on a post
- [ ] Try adding reply without authentication (should show login modal)

#### Voting System

- [ ] Upvote a post (button turns blue)
- [ ] Click upvote again (toggle - button turns gray)
- [ ] Downvote a post (button turns red)
- [ ] Click downvote again (toggle - button turns gray)
- [ ] Upvote then downvote (mutual exclusion)
- [ ] Refresh page (vote state persists)
- [ ] Try voting without authentication (should show login modal)

#### AI Features

- [ ] View similar questions (AI-powered)
- [ ] View AI reply suggestions
- [ ] View discussion summary (when replies exist)

#### Real-time Updates

- [ ] Open app in two browser windows
- [ ] Create post in one window (should appear in other)
- [ ] Add reply in one window (should appear in other)
- [ ] Upvote in one window (count updates in other)

---

## 🐛 Troubleshooting

### Common Issues

#### 1. "Cannot connect to MongoDB"

**Solution:**

- Check `MONGO_URI` in `backend/.env`
- Ensure MongoDB Atlas cluster is running
- Verify network access settings in MongoDB Atlas
- Check if IP address is whitelisted (0.0.0.0/0 for development)

```bash
# Test connection
cd backend
node -e "require('./config/database')()"
```

#### 2. "CORS Error"

**Solution:**

- Ensure `FRONTEND_URL` in `backend/.env` matches your frontend URL
- Default: `http://localhost:5173`
- For Docker: `http://localhost:80`

```env
# backend/.env
FRONTEND_URL=http://localhost:5173
```

#### 3. "Firebase not initialized"

**Solution:**

- Check all `VITE_FIREBASE_*` variables in `frontend/.env`
- Ensure Firebase project has Email/Password and Google auth enabled
- Restart dev server after changing .env

```bash
cd frontend
npm run dev
```

#### 4. "Gemini API Error"

**Solution:**

- Verify `GEMINI_API_KEY` in `backend/.env`
- Verify `VITE_GEMINI_API_KEY` in `frontend/.env`
- Check API key is valid and not expired
- Ensure API is enabled in Google Cloud Console

#### 5. "Port already in use"

**Solution:**

```bash
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Linux/Mac
lsof -ti:5000 | xargs kill -9
```

#### 6. Environment variables not loading

**Solution:**

- Ensure `.env` file exists (not just `.env.example`)
- Restart the development server
- Check for typos in variable names
- No spaces around `=` in .env files

```env
# ❌ Wrong
PORT = 5000

# ✅ Correct
PORT=5000
```

#### 7. Docker containers not starting

**Solution:**

```bash
# Check logs
docker-compose logs

# Rebuild containers
docker-compose down
docker-compose up -d --build

# Remove volumes (WARNING: deletes database)
docker-compose down -v
```

---

## 📝 Available Scripts

### Backend

```bash
npm start          # Start server
npm run dev        # Start with nodemon (auto-restart)
npm test           # Run tests
```

### Frontend

```bash
npm run dev        # Start development server
npm run build      # Build for production
npm run preview    # Preview production build
npm run lint       # Run ESLint
```

---

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License.

---

## 👥 Authors

- **Kiran Dhawan** - [GitHub Profile](https://github.com/kiransdhawan)

---

## 🙏 Acknowledgments

- **Firebase** - Authentication service
- **Google Gemini** - AI features
- **MongoDB Atlas** - Database hosting
- **Socket.io** - Real-time communication
- **Tailwind CSS** - UI styling
- **React Icons** - Icon library

---

## 📞 Support

If you encounter any issues:

1. Check the [Troubleshooting](#-troubleshooting) section
2. Review [ENV_SETUP.md](ENV_SETUP.md) for environment configuration
3. Check [README_DOCKER.md](README_DOCKER.md) for Docker-specific issues
4. Open an issue on GitHub

---

## 🎯 Features Roadmap

- [ ] User profiles
- [ ] Post categories/tags
- [ ] File attachments
- [ ] Notifications system
- [ ] Email notifications
- [ ] Advanced search with filters
- [ ] User reputation system
- [ ] Markdown support in posts
- [ ] Code syntax highlighting
- [ ] Mobile app (React Native)

---

**Made with ❤️ for the Learnato**
