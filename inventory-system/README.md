# InvenTrack — Inventory & Order Management System

Full-stack app: React + FastAPI + PostgreSQL, fully containerized with Docker.

## Quick Start (Docker — Recommended)

### Prerequisites
- Docker Desktop installed and running

### Run the entire app with one command:
```bash
docker-compose up --build
```

Then open:
- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:8000
- **API Docs (Swagger):** http://localhost:8000/docs

---

## Local Development (without Docker)

### Backend
```bash
cd backend
pip install -r requirements.txt

# Set your local DB URL
export DATABASE_URL=postgresql://postgres:postgres@localhost:5432/inventory

uvicorn main:app --reload
```

### Frontend
```bash
cd frontend
npm install

# Point to local backend
echo "REACT_APP_API_URL=http://localhost:8000" > .env

npm start
```

---

## Project Structure
```
inventory-system/
├── backend/
│   ├── main.py          # FastAPI app entry
│   ├── database.py      # DB connection
│   ├── models.py        # SQLAlchemy models
│   ├── schemas.py       # Pydantic schemas
│   ├── routers/
│   │   ├── products.py
│   │   ├── customers.py
│   │   ├── orders.py
│   │   └── dashboard.py
│   ├── requirements.txt
│   └── Dockerfile
├── frontend/
│   ├── src/
│   │   ├── App.js
│   │   ├── App.css
│   │   ├── api/index.js
│   │   └── components/
│   │       ├── Dashboard/
│   │       ├── Products/
│   │       ├── Customers/
│   │       └── Orders/
│   ├── public/
│   ├── package.json
│   └── Dockerfile
└── docker-compose.yml
```

## Deployment

### Backend → Render / Railway / Fly.io
Set environment variable:
```
DATABASE_URL=<your-postgres-connection-string>
```

### Frontend → Vercel / Netlify
Set environment variable:
```
REACT_APP_API_URL=<your-deployed-backend-url>
```
