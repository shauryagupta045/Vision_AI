# Personal AI

A full-stack personal AI assistant application built with React frontend and Node.js/Express backend. Features AI-powered chat functionality and image generation using Google Gemini AI.

## Features

- User authentication (login/signup)
- AI-powered chat interface
- Image generation using Google Gemini AI
- Responsive design with sidebar navigation
- Real-time toast notifications
- Secure JWT-based authentication
- MongoDB for data storage

## Tech Stack

### Frontend
- React 18
- Vite
- React Router DOM
- Google Generative AI
- React Markdown
- DOMPurify
- CSS for styling

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT for authentication
- bcrypt for password hashing
- CORS

## Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd personal-ai
   ```

2. Install frontend dependencies:
   ```bash
   cd frontend
   npm install
   ```

3. Install backend dependencies:
   ```bash
   cd backend
   npm install
   ```

## Environment Setup

Create a `.env` file in the `backend` directory with the following variables:

```env
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
GOOGLE_API_KEY=your_google_gemini_api_key
```

## Running the Application

1. Start the backend server:
   ```bash
   cd backend
   npm run dev
   ```
   The backend will run on `http://localhost:5000` (or configured port)

2. Start the frontend development server:
   ```bash
   cd frontend
   npm run dev
   ```
   The frontend will run on `http://localhost:5173` (Vite default)

## Usage

1. Open your browser and navigate to the frontend URL
2. Create an account or login
3. Access the chat interface for AI conversations
4. Use the image generation feature to create AI-generated images
5. Navigate between different sections using the sidebar

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout

### Chat
- `GET /api/chat` - Get user's chat history
- `POST /api/chat` - Send a message to AI
- `DELETE /api/chat/:id` - Delete a chat

## Deployment

The project is configured for deployment on Vercel:

- Frontend: Deployed as a static site
- Backend: Deployed as a serverless function

Use the respective `vercel.json` files in each directory for deployment configuration.

## Build Commands

### Frontend
```bash
npm run build  # Build for production
npm run preview  # Preview production build
```

### Backend
```bash
npm start  # Start production server
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request


