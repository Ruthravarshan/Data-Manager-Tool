# Clinical Cosmos - Data Manager Tool

## Prerequisites
- **Node.js** (v16+)
- **Python** (v3.8+)
- **PostgreSQL** (Ensure the service is running)

---

## 🚀 How to Run the Application

### 1. Backend Setup (Python/FastAPI)

Open a terminal and navigate to the `backend` directory:
```bash
cd backend
```

**Step A: Create & Activate Virtual Environment**
```bash
# Create virtual environment
python -m venv .venv

# Activate (Windows)
.venv\Scripts\activate

# Activate (Mac/Linux)
source .venv/bin/activate
```

**Step B: Install Dependencies**
```bash
pip install -r requirements.txt
```

**Step C: Database Setup**
Ensure your PostgreSQL server is running. Then run the following scripts to create the database, tables, and seed initial data:
```bash
# Create the 'clinical_cosmos' database
python setup_postgres_db.py

# Create tables
python create_db.py

# Populate with sample data
python seed_db.py
```
*Note: Ensure you have a `.env` file in the `backend` folder with your database credentials (e.g., `DATABASE_URL=postgresql://postgres:postgres@localhost:5432/clinical_cosmos`).*

**Step D: Start the Backend Server**
```bash
uvicorn app.main:app --reload
```
The backend API will run at `http://localhost:8000`.
API Documentation: `http://localhost:8000/docs`

---

### 2. Frontend Setup (React)

Open a **new terminal** and navigate to the `clinical-cosmos-app` directory:
```bash
cd clinical-cosmos-app
```

**Step A: Install Dependencies**
```bash
npm install
```

**Step B: Start the Development Server**
```bash
npm run dev
```
The application will open at `http://localhost:5173`.

---

## 🌐 Accessing the App

1.  Keep both terminals running (one for Backend, one for Frontend).
2.  Open your browser to **http://localhost:5173**.
3.  Navigate to **Study Management** to see the data loaded from your local database.
