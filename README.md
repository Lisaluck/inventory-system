# InvenTrack - Inventory & Order Management System

A full-stack inventory and order management system built with FastAPI and React.

## 🛠️ Tech Stack

**Backend:**
- Python & FastAPI
- SQLAlchemy (ORM)
- SQLite Database
- Uvicorn Server

**Frontend:**
- React.js
- Node.js

**DevOps:**
- Docker & Docker Compose
- WSL2 (Windows)

## ✨ Features

- 📦 **Products** — Add, manage stock & pricing
- 👥 **Customers** — Customer database management  
- 📋 **Orders** — Create & track orders
- 📊 **Dashboard** — Business overview & analytics

## 🚀 Getting Started

### Prerequisites
- Docker Desktop
- WSL2 (Windows users)

### Installation

1. Clone the repo
\```bash
git clone https://github.com/Lisaluck/inventory-system.git
cd inventory-system
\```

2. Run with Docker
\```bash
docker-compose up --build
\```

3. Open in browser
\```
Frontend: http://localhost:3000
Backend API: http://localhost:8000
\```

## 📁 Project Structure

\```
inventory-system/
├── main.py          # FastAPI entry point
├── database.py      # DB connection
├── models.py        # Database models
├── schemas.py       # Data validation
├── routers/
│   ├── products.py
│   ├── customers.py
│   ├── orders.py
│   └── dashboard.py
├── docker-compose.yml
└── requirements.txt
\```

## 🔗 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /products | All products |
| POST | /products | Add product |
| GET | /customers | All customers |
| POST | /customers | Add customer |
| GET | /orders | All orders |
| POST | /orders | Create order |
| GET | /dashboard | Analytics |

## 👤 Author
**Leeli Mahajan** — [GitHub](https://github.com/Lisaluck)
