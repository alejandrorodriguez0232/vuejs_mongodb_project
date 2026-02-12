# MERN + Vue.js Project

Full-stack application using MongoDB, Express, Vue.js, and Node.js with complete CRUD functionality for user management.

## 🚀 Quick Start

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (local installation or MongoDB Atlas)
- npm or yarn

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create environment variables:
```bash
cp .env_example.env .env
```

4. Configure the `.env` file with your settings:
```env
MONGODB_URI=mongodb://localhost:27017/mern_vue_db
PORT=5000
NODE_ENV=development
```

```powershell
# Start MongoDB
mongod
# or
net start MongoDB
```

```powershell
# Start Backend
cd backend
npm run dev
```

```powershell
# Start Frontend
cd frontend
npm run serve
```

```powershell
cd backend
npm run dev
```

```powershell
cd frontend
npm run serve
```

5. Start the backend server:
```bash
# Development mode (with nodemon)
npm run dev

# Production mode
npm start
```

The backend will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
# Either command works (both do the same)
npm run serve
# or
npm run dev
```

The frontend will run on `http://localhost:8080`

## 📋 Available Scripts

### Backend Scripts
- `npm start` - Start production server
- `npm run dev` - Start development server with auto-reload
- `npm test` - Run tests (currently not implemented)

### Frontend Scripts
- `npm run serve` - Start development server
- `npm run dev` - Start development server (alias for serve)
- `npm run build` - Build for production
- `npm run lint` - Run ESLint

## 🔧 Environment Variables

### Backend (.env)
Create a `.env` file in the `backend` directory with the following variables:

```env
# Database
MONGODB_URI=mongodb://localhost:27017/mern_vue_db

# Server
PORT=5000
NODE_ENV=development

# Optional: For production
# JWT_SECRET=your_jwt_secret_key
# CORS_ORIGIN=http://localhost:8080
```

### Frontend Environment
The frontend uses the following environment variables automatically:
- `NODE_ENV` - Determines API base URL (development uses localhost:5000, production uses /api)

## 🏗️ Project Structure

```
vuejs_project/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── database.js      # MongoDB connection
│   │   ├── controllers/
│   │   │   └── userController.js # User CRUD operations
│   │   ├── middleware/
│   │   │   └── errorHandler.js   # Error handling
│   │   ├── models/
│   │   │   └── User.js           # User model/schema
│   │   ├── routes/
│   │   │   └── userRoutes.js     # User API routes
│   │   └── server.js             # Express server setup
│   ├── .env                      # Environment variables (gitignored)
│   ├── .env_example.env          # Environment variables template
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   ├── router/
│   │   ├── services/
│   │   │   └── api.js            # API service configuration
│   │   ├── views/
│   │   │   ├── Home.vue          # User management interface
│   │   │   └── About.vue         # About page
│   │   ├── App.vue               # Main application component
│   │   └── main.js               # Application entry point
│   └── package.json
├── .gitignore
└── README.md
```

## 📡 API Endpoints

### Users
- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get user by ID
- `POST /api/users` - Create new user
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

### Health Check
- `GET /api/health` - Check API status

## 🐛 Troubleshooting

### Common Issues

1. **Port conflicts**: Make sure ports 5000 (backend) and 8080 (frontend) are available
2. **MongoDB connection**: Ensure MongoDB is running and the connection string is correct
3. **CORS errors**: Check that the frontend URL matches the CORS origin in the backend
4. **Environment variables**: Verify all required variables are set in the `.env` file

### Development Tips

- The backend automatically restarts when files change (using nodemon)
- The frontend hot-reloads automatically in development
- Check the browser console for API connection status
- Use the browser's Network tab to debug API requests

## 🛠️ Technologies Used

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - MongoDB object modeling
- **CORS** - Cross-origin resource sharing
- **dotenv** - Environment variable management

### Frontend
- **Vue.js 3** - JavaScript framework
- **Vue Router** - Client-side routing
- **Axios** - HTTP client
- **PrimeVue** - UI component library
- **SCSS** - CSS preprocessor

## 📝 Features

- ✅ Complete CRUD operations for users
- ✅ Responsive design with mobile support
- ✅ Real-time form validation
- ✅ Search and filter functionality
- ✅ Error handling and user feedback
- ✅ API health monitoring
- ✅ Modern UI with animations
- ✅ Toast notifications
- ✅ Modal confirmations

## 🚀 Deployment

### Backend Deployment
1. Set `NODE_ENV=production` in your environment
2. Configure production database URL
3. Build and start the server with `npm start`

### Frontend Deployment
1. Run `npm run build` to create production build
2. Deploy the `dist` folder to your web server
3. Configure the server to serve the frontend and proxy API requests

## 📄 License

This project is licensed under the MIT License.
