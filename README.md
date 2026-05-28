# Orbitra Trip

Orbitra Trip is a travel companion app that transforms chaotic booking receipts into neat, chronological travel itineraries. By uploading booking confirmation PDFs or images (like flights, hotels, and train tickets), Orbitra uses the Google Gemini API to parse the documents and generate a day-by-day trip roadmap automatically.

---

## Key Features

* **AI Document Parsing**: Drop your booking confirmations (PDF, JPEG, PNG, or WebP) and let the AI extract dates, times, locations, and descriptions.
* **Interactive Timelines**: View your flight, lodging, transit, and local activities organized day-by-day in a clean visual layout.
* **Public Trip Sharing**: Generate a secure shareable link for each itinerary so friends or family can view your schedule without needing an account.
* **Secure Session Handling**: Uses JWT authentication with rotated refresh tokens stored in HTTP-only, secure cookies.
* **Responsive Dark UI**: Designed with a premium, responsive glassmorphism dark aesthetic for modern desktop and mobile viewports.

---

## Tech Stack

* **Frontend**: React (Vite), Lucide Icons, Axios
* **Backend**: Node.js, Express 5.0, Mongoose (MongoDB Atlas)
* **Storage**: Cloudinary (for secure document uploads and hosting)
* **AI Engine**: Google Gemini API (with automatic fallback strategy)

---

## Folder Structure

```text
/
├── backend/                  # Express API Server
│   ├── config/              # Database connectivity
│   ├── controllers/         # HTTP controller handlers
│   ├── middleware/          # Request interceptors (security, validation, rate limits)
│   ├── models/              # Mongoose database models
│   ├── repositories/        # Database abstraction layer (Repository pattern)
│   ├── routes/              # Express route definitions
│   ├── services/            # Core business logic & Gemini/Cloudinary integrations
│   └── utils/               # App error classes, constants, and helpers
└── frontend/                 # React Single Page App
    ├── src/
    │   ├── api/             # Axios API integration clients
    │   ├── components/      # Reusable UI widgets
    │   ├── context/         # Auth contexts and session persistence
    │   ├── pages/           # Pages (Dashboard, Share Page, Login/Signup)
    │   └── utils/           # Frontend helper utilities
```

---

## Getting Started

### Prerequisites
* Node.js (v18 or higher)
* A MongoDB database (local installation or Atlas cluster)
* A Cloudinary account (for media uploads)
* A Google Gemini API key

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the `backend/` folder and populate it with your credentials:
   ```env
   PORT=5000
   NODE_ENV=development
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   ACCESS_TOKEN_SECRET=your_access_token_secret
   ACCESS_TOKEN_EXPIRY=15m
   REFRESH_TOKEN_SECRET=your_refresh_token_secret
   REFRESH_TOKEN_EXPIRY=7d
   FRONTEND_URL=http://localhost:5173
   MODEL_API_KEY=your_gemini_api_key
   CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
   CLOUDINARY_API_KEY=your_cloudinary_api_key
   CLOUDINARY_API_SECRET=your_cloudinary_api_secret
   UPLOAD_DIR=uploads
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the Vite development server:
   ```bash
   npm run dev
   ```

The frontend will run on `http://localhost:5173`.

---

## Live Application

You can access the live version of Orbitra Trip here:
https://orbitra-trip.vercel.app
