# ExtraCurricula Backend API

A Node.js/Express backend API for the ExtraCurricula application, providing endpoints for managing lessons and orders.

## 🚀 Features

- RESTful API for lessons and orders management
- MongoDB Atlas integration for data persistence
- CORS support for frontend integration
- Validation for data inputs
- Deployed on Render.com

## 📋 API Endpoints

### Lessons

- `GET /lessons` - Retrieve all lessons (with optional search query)
- `PUT /lessons/:id` - Update lesson spaces

### Orders

- `POST /orders` - Create a new order with customer information and lesson selections

## 🛠️ Tech Stack

- Node.js
- Express.js
- MongoDB Atlas
- CORS for cross-origin requests
- dotenv for environment variable management

## 🔧 Setup & Installation

1. Clone the repository:
   ```
   git clone https://github.com/adedoyinashogbon/extracurricula_backend.git
   cd extracurricula_backend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create a `.env` file in the root directory with the following variables:
   ```
   PORT=4000
   MONGO_URI=your_mongodb_connection_string
   ```

4. Start the development server:
   ```
   npm run dev
   ```

5. For production:
   ```
   npm start
   ```

## 📦 Project Structure

```
extracurricula_backend/
├── db.js                # MongoDB connection setup
├── middleware/
│   └── logger.js        # Request logging middleware
├── routes/
│   ├── lessons.js       # Lesson-related endpoints
│   └── orders.js        # Order-related endpoints
├── server.js            # Main application entry point
├── package.json         # Project dependencies and scripts
└── .env                 # Environment variables (not in repo)
```

## 🔄 Integration with Frontend

This backend is designed to work with the [ExtraCurricula Frontend](https://github.com/adedoyinashogbon/extracurricula_frontend) application. The API supports CORS for both local development and the deployed GitHub Pages frontend.

## 🚀 Deployment

The backend is deployed on Render.com at:
https://extracurricula-backend.onrender.com
