# InterviewOG 

InterviewOG is a full-stack, AI-powered mock interview platform. It generates role- and level-specific interview questions, lets candidates answer by voice or by writing code, transcribes and evaluates their responses using a local LLM, and gives them a scored breakdown of their performance.

The project is split into three services:

| Service | Stack | Purpose |
|---|---|---|
| `frontend` | React 19 + Vite + Redux Toolkit + Tailwind CSS | Candidate-facing web app (auth, dashboard, live interview runner, session review) |
| `backend` | Node.js + Express 5 + MongoDB (Mongoose) + Socket.IO | REST API, auth, session/question persistence, real-time updates, orchestrates calls to the AI service |
| `ai-service` | Python + FastAPI + Ollama + OpenAI Whisper | Generates interview questions, transcribes spoken answers, and evaluates answers/code with a local LLM |

## Features

- **Authentication** — email/password signup & login (JWT) plus Google OAuth login
- **Interview sessions** — configurable by target role, experience level, and interview type (`oral-only` or `coding-mix`)
- **AI-generated questions** — a local LLM (via Ollama) generates a mix of conceptual and coding questions per session
- **Voice & code answers** — record spoken answers (auto-transcribed with Whisper) or submit code in an in-browser Monaco editor
- **AI evaluation** — each answer is scored for technical accuracy and confidence, with written AI feedback and an ideal-answer reference
- **Session dashboard & review** — track past sessions, overall scores, and per-question breakdowns, visualized with Chart.js
- **Real-time updates** — Socket.IO keeps session state in sync during a live interview

## Architecture

```
frontend (React/Vite, :5173)
     │  REST + Socket.IO
     ▼
backend (Express/Node, :5000)
     │  MongoDB (sessions, users)
     │  REST calls
     ▼
ai-service (FastAPI/Python, :8000)
     │  Whisper (speech-to-text)
     │  Ollama (question generation + evaluation)
```

## Prerequisites

- Node.js 18+ and npm
- Python 3.10+
- MongoDB (local instance or a connection string, e.g. MongoDB Atlas)
- [Ollama](https://ollama.com) installed locally, with a model pulled (defaults to `mistral`)
- `ffmpeg` installed on your system (required by `pydub` for audio processing)
- A Google OAuth Client ID (only needed if you want Google sign-in)

## Getting Started

### 1. Clone the repo

```bash
git clone https://github.com/AdityaGoyal-512/InterviewOG.git
cd InterviewOG
```

### 2. Backend setup

```bash
cd backend
npm install
```

Create a `.env` file in `backend/`:

```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb://localhost:27017/interviewog
JWT_SECRET=your_jwt_secret
GOOGLE_CLIENT_ID=your_google_oauth_client_id
```

Run it:

```bash
npm run dev      # nodemon, auto-restarts on changes
# or
npm start
```

### 3. AI service setup

```bash
cd ai-service
python -m venv venv
source venv/bin/activate   # Windows: venv\Scripts\activate
pip install -r requirements.txt
```

Create a `.env` file in `ai-service/` (optional — sensible defaults are used if omitted):

```env
AI_SERVICE_PORT=8000
OLLAMA_MODEL_NAME=mistral
```

Make sure Ollama is running and has the model pulled:

```bash
ollama pull mistral
ollama serve
```

Run the service:

```bash
uvicorn main:app --reload --port 8000
```

### 4. Frontend setup

```bash
cd frontend
npm install
npm run dev
```

The app will be available at `http://localhost:5173`.

## Project Structure

```
InterviewOG/
├── ai-service/           # FastAPI microservice
│   ├── main.py            # Question generation, transcription, and evaluation endpoints
│   └── requirements.txt
├── backend/               # Express API
│   ├── config/             # Database connection
│   ├── controllers/        # Route handlers (users, sessions)
│   ├── middleware/         # Auth, error handling, file upload
│   ├── models/             # Mongoose schemas (User, Session)
│   ├── routes/             # API route definitions
│   └── server.js
└── frontend/               # React app
    └── src/
        ├── app/             # Redux store setup
        ├── features/        # Redux slices (auth, sessions)
        ├── pages/           # Login, Register, Dashboard, InterviewRunner, SessionReview, Profile
        ├── components/
        └── hooks/
```

## Key API Endpoints

**Backend** (`http://localhost:5000/api`)

| Method | Endpoint | Description |
|---|---|---|
| POST | `/users/register` | Create a new account |
| POST | `/users/login` | Log in with email/password |
| POST | `/users/google` | Log in with Google |
| GET/PUT | `/users/profile` | Get/update the logged-in user's profile |
| GET/POST | `/sessions` | List sessions / start a new interview session |
| GET/DELETE | `/sessions/:id` | Fetch or delete a session |
| POST | `/sessions/:id/submit-answer` | Submit a voice recording or code answer |
| POST | `/sessions/:id/end` | End and finalize a session |

**AI service** (`http://localhost:8000`)

| Method | Endpoint | Description |
|---|---|---|
| POST | `/generate-questions` | Generate interview questions for a role/level/type |
| POST | `/transcribe` | Transcribe an uploaded audio answer |
| POST | `/evaluate` | Score an answer (oral or code) and return feedback |

## Notes

- The AI service currently talks to Ollama on the default local endpoint, so the model runs entirely on your own machine (no external API keys needed for question generation/evaluation).
- CORS in the backend is currently configured for local frontend ports (`5173`/`5174`); update `allowedOrigins` in `server.js` for other environments.

## License

No license has been specified yet for this repository.
