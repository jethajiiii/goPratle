# Requirement Posting Flow

A full-stack **multi-step form wizard** that lets a client post a project requirement.

| Layer | Tech |
|-------|------|
| Frontend | Next.js 16 · React 19 · Vanilla CSS |
| Backend | Express 4 · MongoDB · Mongoose 8 |
| Validation | Joi (server) · custom pure functions (client) |
| Deployment | Vercel (frontend) · Render (backend) |

---

## Project Structure

```
requirement-posting-flow/
├── frontend/                        # Next.js 16 app
│   ├── app/
│   │   ├── post/page.jsx            # Multi-step form shell (orchestrator)
│   │   ├── success/page.jsx         # Confirmation page after submission
│   │   ├── layout.jsx               # Root HTML shell + metadata
│   │   └── globals.css              # Design system (tokens, components, layout)
│   ├── components/
│   │   ├── FormField.jsx            # Reusable label + input + error wrapper
│   │   ├── StepIndicator.jsx        # Animated step progress bar
│   │   ├── steps/
│   │   │   ├── BasicInfoStep.jsx        # Step 1 — title, description, category
│   │   │   ├── CategoryFieldsStep.jsx   # Step 2 — dynamic fields by category
│   │   │   ├── BudgetTimelineStep.jsx   # Step 3 — budget, deadline, work mode
│   │   │   └── ReviewStep.jsx           # Step 4 — read-only summary before submit
│   │   └── ui/
│   │       ├── Button.jsx           # Reusable button (primary/secondary/ghost)
│   │       ├── LoadingSpinner.jsx   # Page-level loading indicator
│   │       └── ErrorBanner.jsx      # Dismissible submission-level error
│   ├── hooks/
│   │   └── useMultiStepForm.js      # Step navigation + form state (custom hook)
│   └── lib/
│       ├── api.js                   # All backend fetch calls (single source)
│       ├── validation.js            # Pure form validation functions
│       └── constants.js             # Categories, field definitions, step config
│
└── backend/                         # Express API
    └── src/
        ├── config/
        │   ├── db.js                # MongoDB connection (called once on startup)
        │   └── env.js               # All process.env reads in one place
        ├── controllers/
        │   └── requirementController.js  # Business logic only
        ├── middleware/
        │   ├── asyncHandler.js      # Wraps async handlers — no repetitive try/catch
        │   ├── errorHandler.js      # Global error handler (last middleware in chain)
        │   └── validateRequirement.js    # Joi validation before data hits the DB
        ├── models/
        │   └── Requirement.js       # Mongoose schema (schema only — no logic)
        ├── routes/
        │   └── requirementRoutes.js # Route declarations only
        └── server.js                # App bootstrap — middleware, routes, error handler
```

---

## How the Parts Connect

```
Browser (Next.js 16)
  └─ app/post/page.jsx          ← form shell
       ├─ useMultiStepForm.js   ← step & form state
       ├─ lib/validation.js     ← validates per step
       └─ lib/api.js            ← POSTs to backend
                                        ↓
                           Express (backend/src/server.js)
                             └─ /api/requirements
                                  ├─ validateRequirement  ← Joi validation
                                  ├─ requirementController ← saves to MongoDB
                                  └─ errorHandler         ← catches all errors
                                                ↓
                                         MongoDB Atlas / Local
```

---

## Getting Started

### Prerequisites

- **Node.js** ≥ 18
- **MongoDB** running locally (`mongod`) **or** a MongoDB Atlas connection string

---

### 1 — Start the Backend

```bash
cd backend

# Copy the example env and fill in your MongoDB URI
cp .env.example .env

npm install
npm run dev
```

**Default environment variables** (from `.env.example`):

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/requirement-posting
FRONTEND_ORIGIN=http://localhost:3000
NODE_ENV=development
```

The API starts at **http://localhost:5000**.  
You should see:
```
✅ MongoDB connected: localhost
🚀 Server running on http://localhost:5000 [development]
```

---

### 2 — Start the Frontend

```bash
cd frontend

npm install
npm run dev
```

**Default environment variable** (`.env.local` — already pre-filled for local dev):

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

> **Deployed backend?** Update `NEXT_PUBLIC_API_URL` to point to your live API, e.g. `https://your-app.onrender.com/api`

The app starts at **http://localhost:3000** and redirects immediately to **/post**.

---

## API Reference

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/requirements` | Create a new requirement |
| `GET` | `/api/requirements/:id` | Fetch a requirement by ID |
| `GET` | `/health` | Server health check |

### POST `/api/requirements` — Request Body

```json
{
  "title": "Build a multi-vendor e-commerce platform",
  "description": "We need a scalable platform…",
  "category": "it-services",
  "categoryFields": {
    "serviceType": "Web Development",
    "techStack": "React, Node.js",
    "platform": "Web",
    "experienceLevel": "Expert"
  },
  "budget": { "min": 50000, "max": 200000, "currency": "INR" },
  "deadline": "2025-03-01",
  "workMode": "remote"
}
```

### Response Shape

**Success `201`**
```json
{
  "success": true,
  "data": { "_id": "…", "title": "…", "…": "…" }
}
```

**Error (any 4xx / 5xx)**
```json
{
  "success": false,
  "message": "Human-readable error description"
}
```

---

## Scripts

| Directory | Command | Description |
|-----------|---------|-------------|
| `backend` | `npm run dev` | Start server with nodemon (hot-reload) |
| `backend` | `npm start` | Start server without hot-reload |
| `backend` | `npm run lint` | Lint backend source files |
| `frontend` | `npm run dev` | Start Next.js dev server |
| `frontend` | `npm run build` | Build production bundle |
| `frontend` | `npm start` | Serve the production build |
| `frontend` | `npm run lint` | Lint frontend source files |

---

## Key Design Decisions

### Frontend

- **`lib/constants.js` is the single source of truth** for step config, categories, and field definitions. Adding a new step or category requires editing only this one file.
- **`lib/validation.js` contains only pure functions** — no React, no side effects. Each step's validator returns `{ isValid, errors }`.
- **`lib/api.js` owns all network calls** — changing the base URL only requires editing `NEXT_PUBLIC_API_URL`.
- **`useMultiStepForm` hook** owns all step navigation and form state, keeping the page component a thin orchestrator.
- **`FormField` component** eliminates the label + input + error pattern repeated across every step.

### Backend

- **`config/env.js` is the only place `process.env` is read** — all other files import the `env` object, making environment changes a single-file concern.
- **`asyncHandler` wrapper** eliminates repetitive `try/catch` in every controller — errors propagate to the global handler automatically.
- **One global `errorHandler`** ensures all error responses share the same `{ success, message }` shape.
- **Joi validation middleware** runs before the controller — the controller never receives invalid data.
- **`Requirement` model is schema-only** — no business logic lives in the model file.

---

## Dependencies

### Backend

| Package | Version | Purpose |
|---------|---------|---------|
| `express` | ^4.19.2 | HTTP server & routing |
| `mongoose` | ^8.4.1 | MongoDB ODM |
| `joi` | ^17.13.1 | Request body validation |
| `cors` | ^2.8.5 | Cross-origin resource sharing |
| `dotenv` | ^16.4.5 | Environment variable loading |
| `nodemon` *(dev)* | ^3.1.3 | Auto-restart on file changes |

### Frontend

| Package | Version | Purpose |
|---------|---------|---------|
| `next` | 16.3.4 | React framework (App Router) |
| `react` | 19.2.8 | UI library |
| `react-dom` | 19.2.8 | React DOM renderer |

---

## Project Structure

```
requirement-posting-flow/
├── frontend/                        # Next.js 14 app
│   ├── app/
│   │   ├── post/page.jsx            # Multi-step form shell (orchestrator)
│   │   ├── success/page.jsx         # Confirmation page after submission
│   │   ├── layout.jsx               # Root HTML shell + metadata
│   │   └── globals.css              # Design system (tokens, components, layout)
│   ├── components/
│   │   ├── FormField.jsx            # Reusable label + input + error wrapper
│   │   ├── StepIndicator.jsx        # Animated step progress bar
│   │   ├── steps/
│   │   │   ├── BasicInfoStep.jsx        # Step 1 — title, description, category
│   │   │   ├── CategoryFieldsStep.jsx   # Step 2 — dynamic fields by category
│   │   │   ├── BudgetTimelineStep.jsx   # Step 3 — budget, deadline, work mode
│   │   │   └── ReviewStep.jsx           # Step 4 — read-only summary before submit
│   │   └── ui/
│   │       ├── Button.jsx           # Reusable button (primary/secondary/ghost)
│   │       ├── LoadingSpinner.jsx   # Page-level loading indicator
│   │       └── ErrorBanner.jsx      # Dismissible submission-level error
│   ├── hooks/
│   │   └── useMultiStepForm.js      # Step navigation + form state (custom hook)
│   └── lib/
│       ├── api.js                   # All backend fetch calls (single source)
│       ├── validation.js            # Pure form validation functions
│       └── constants.js             # Categories, field definitions, step config
│
└── backend/                         # Express API
    └── src/
        ├── config/
        │   ├── db.js                # MongoDB connection (called once on startup)
        │   └── env.js               # All process.env reads in one place
        ├── controllers/
        │   └── requirementController.js  # Business logic only
        ├── middleware/
        │   ├── asyncHandler.js      # Wraps async handlers — no repetitive try/catch
        │   ├── errorHandler.js      # Global error handler (last middleware in chain)
        │   └── validateRequirement.js    # Joi validation before data hits the DB
        ├── models/
        │   └── Requirement.js       # Mongoose schema (schema only — no logic)
        ├── routes/
        │   └── requirementRoutes.js # Route declarations only
        └── server.js                # App bootstrap — middleware, routes, error handler
```

---

## How the Parts Connect

```
Browser (Next.js)
  └─ app/post/page.jsx          ← form shell
       ├─ useMultiStepForm.js   ← step & form state
       ├─ lib/validation.js     ← validates on Next →
       └─ lib/api.js            ← POSTs to backend
                                        ↓
                           Express (backend/src/server.js)
                             └─ /api/requirements
                                  ├─ validateRequirement  ← Joi validation
                                  ├─ requirementController ← saves to MongoDB
                                  └─ errorHandler         ← catches all errors
                                                ↓
                                         MongoDB Atlas / Local
```

---

## Getting Started

### Prerequisites
- Node.js ≥ 18
- MongoDB running locally (`mongod`) **or** a MongoDB Atlas URI

---

### 1 — Start the Backend

```bash
cd backend

# Copy the example env and fill in your MongoDB URI if needed
cp .env.example .env

npm install
npm run dev
```

The API will start at **http://localhost:5000**.  
You should see: `✅ MongoDB connected: localhost` and `🚀 Server running on http://localhost:5000 [development]`

---

### 2 — Start the Frontend

```bash
cd frontend

# .env.local is already pre-filled for local development
npm install
npm run dev
```

The app will start at **http://localhost:3000** and redirect immediately to **/post**.

---

## API Reference

| Method | Endpoint                  | Description                     |
|--------|---------------------------|---------------------------------|
| POST   | `/api/requirements`       | Create a new requirement        |
| GET    | `/api/requirements/:id`   | Fetch a requirement by ID       |
| GET    | `/health`                 | Server health check             |

### POST `/api/requirements` — Request body

```json
{
  "title": "Build a multi-vendor e-commerce platform",
  "description": "We need a scalable platform…",
  "category": "it-services",
  "categoryFields": {
    "serviceType": "Web Development",
    "techStack": "React, Node.js",
    "platform": "Web",
    "experienceLevel": "Expert"
  },
  "budget": { "min": 50000, "max": 200000, "currency": "INR" },
  "deadline": "2025-03-01",
  "workMode": "remote"
}
```

---

## Key Design Decisions

### Frontend
- **`lib/constants.js` is the single source of truth** for step config, categories, and field definitions. Adding a new step or category only requires editing this one file.
- **`lib/validation.js` contains only pure functions** — no React, no side effects. Each step's validator returns `{ isValid, errors }`.
- **`lib/api.js` owns all network calls** — changing the base URL only requires editing one line.
- **`useMultiStepForm` hook** owns all step navigation and form state, keeping the page component a thin orchestrator.
- **`FormField` component** eliminates the label + input + error pattern repeated across every step.

### Backend
- **`config/env.js` is the only place `process.env` is read** — all other files import the `env` object.
- **`asyncHandler` wrapper** eliminates repetitive `try/catch` in every controller — errors propagate to the global handler automatically.
- **One global `errorHandler`** ensures all error responses share the same `{ success, message }` shape.
- **Joi validation middleware** runs before the controller — the controller never receives invalid data.
- **`Requirement` model is schema-only** — no business logic lives in the model file.
