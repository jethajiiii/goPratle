# Requirement Posting Flow

A full-stack multi-step form wizard that lets a client post a project requirement.  
**Frontend:** Next.js 14 (App Router) · **Backend:** Express + MongoDB

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
