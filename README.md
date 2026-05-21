# AI-Powered Travel Itinerary Planner

A MERN application for AI-powered travel planning. The system parses uploaded travel booking documents (PDFs and JPEG/PNG/WebP images) and generates structured itineraries using the Google Gemini 2.5 Flash API.

---

## Folder Structure

```
/
├── backend/                  # Express 5.0 API Server
│   ├── config/              # Database connectivity
│   ├── controllers/         # HTTP controllers
│   ├── middleware/          # Request interceptors (security, validation, logs)
│   ├── models/              # Mongoose database models
│   ├── repositories/        # Database abstraction layer
│   ├── routes/              # Express route definitions
│   ├── services/            # Core business logic & integrations
│   └── utils/               # App errors, constants, and utilities
└── frontend/                 # React 19 + Vite 8 Single Page App
    ├── src/
    │   ├── api/             # Axios API clients
    │   ├── components/      # Reusable UI widgets
    │   ├── context/         # Auth contexts and session persistence
    │   ├── pages/           # Pages (Dashboard, Share Page, Auth Pages)
    │   └── utils/           # Helper utilities
```

---

## Architectural Highlights

The backend implements a 6-layer architecture ensuring separation of concerns and maintainability:
`Route -> Middleware -> Controller -> Service -> Repository -> Model`

- **Separation of Concerns**: Controllers process HTTP request/response payloads, services handle core business logic, and repositories encapsulate database access, simplifying transitions to alternative data stores.
- **Validation Layers**: Schema validation is performed at the middleware boundary (via Zod) to catch invalid input before execution, while business rule validation (ownership checks) is executed at the service boundary.
- **Logging**: Morgan middleware records requests in development (`dev` style) and logs concise status details in production (`tiny` style).
- **Centralized Error Handling**: Centralized error handler catches exceptions and returns consistent error responses.

---

## Performance & Scalability

- **Database Indexes**: Compound index on `Itinerary` (`user: 1, createdAt: -1`) and query index on `Document` (`user: 1`) prevent full collection scans at scale.
- **Rate-Limiter Cleanup**: Sliding-window rate limiter runs a periodic sweep to prune inactive IPs, preventing memory leaks in long-running processes.
- **Resilience**: Gemini client wraps requests in an exponential-backoff retry loop to tolerate temporary `429` (rate limits) or `503` (service temporary downtime) status responses.

---

## Security

- **HTTP Secure Headers**: Helmet middleware mounts standard security headers.
- **NoSQL Injection Prevention**: Custom query sanitizer strips `$` and `.` MongoDB operator parameters recursively from request body, parameters, and queries.
- **CORS Restriction**: Configured to restrict access exclusively to the defined frontend domain.
- **Authentication**: JWT authentication with password encryption via Bcrypt and refresh token rotation stored in secure, HTTP-only, SameSite=Strict cookies.

---

## Getting Started

### Prerequisites
- Node.js (v18+)
- MongoDB (Local or Atlas instance)
- Cloudinary Account
- Gemini API Key

### Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file using the template below:
   ```env
   PORT=5000
   NODE_ENV=development
   MONGO_URI=mongodb+srv://...
   JWT_SECRET=your_jwt_secret
   ACCESS_TOKEN_SECRET=your_access_token_secret
   ACCESS_TOKEN_EXPIRY=15m
   REFRESH_TOKEN_SECRET=your_refresh_token_secret
   REFRESH_TOKEN_EXPIRY=7d
   FRONTEND_URL=http://localhost:5173
   MODEL_API_KEY=your_gemini_api_key
   CLOUDINARY_CLOUD_NAME=your_cloudinary_name
   CLOUDINARY_API_KEY=your_cloudinary_api_key
   CLOUDINARY_API_SECRET=your_cloudinary_api_secret
   UPLOAD_DIR=uploads
   ```
4. Start the server:
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
3. Start the dev server:
   ```bash
   npm run dev
   ```
   *(Frontend accessible at http://localhost:5173)*
