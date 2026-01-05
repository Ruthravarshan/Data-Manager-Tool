# Clinical Cosmos Application - Comprehensive Overview

## 1. Executive Summary
The **Clinical Cosmos Application** is a "Clinical Business Orchestration and AI Technology Platform". It allows users to manage clinical trials, monitor data quality, and leverage AI agents to automate tasks like data reconciliation and protocol compliance checks.

**Current State**: The application is in a **Hybrid Prototype** phase.
- **Frontend**: A React application (Vite + TypeScript) with a modern UI (Tailwind CSS).
- **Backend**: A FastAPI (Python) server providing API endpoints.
- **Data Source**: 
  - The application structure is set up to consume APIs.
  - However, **most of the UI currently relies on hardcoded "mock" data** for demonstration purposes.
  - The `Dashboard` attempts to fetch live data but falls back to mocks if the backend is unreachable.
  - Complex pages like `DataManagerAI` are currently **100% hardcoded** and do not communicate with the backend.

---

## 2. Technical Architecture

### Frontend (`clinical-cosmos-app`)
- **Framework**: React 19
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Routing**: `react-router-dom`
- **HTTP Client**: `axios` (configured in `src/services/api.ts`)

### Backend (`backend`)
- **Framework**: FastAPI
- **Server**: Uvicorn
- **Database**: Structure exists (`database.py`, `models.py`) but is primarily used for specific endpoints.

---

## 3. Navigation & Page Structure

The application uses client-side routing. Below is the complete site map based on `App.tsx`:

| Route | Component | Status | Description |
|-------|-----------|--------|-------------|
| `/` | `Dashboard` | **Active** | Main landing page with key metrics and charts. |
| `/study-management` | `StudyManagement` | Active | Manage clinical study details. |
| `/data-integration` | `DataIntegration` | Active | View connected data sources (EDC, Labs, etc.). |
| `/trial-data-management` | `TrialDataManagement` | Active | Manage SDTM domains (DM, AE, VS, etc.). |
| `/data-manager-ai` | `DataManagerAI` | **Active (Demo)** | AI Agent simulation for data quality and reconciliation. |
| `/central-monitor-ai` | `CentralMonitorAI` | Active | AI monitoring for site risks and signals. |
| `/signal-detection` | `SignalDetection` | Active | Detect and manage safety signals. |
| `/tasks` | `Tasks` | Active | User task management. |
| `/risk-profiles` | `RiskProfiles` | Active | Risk assessment for studies/sites. |
| `/analytics` | `Analytics` | Active | Visual data analytics. |
| `/notifications` | `Notifications` | Active | System alerts and notifications. |
| `/admin` | `Admin` | Active | System administration. |
| `/ai-agents` | `Placeholder` | Incomplete | Placeholder for AI Agents Hub. |

---

## 4. Deep Dive: Key Pages & Functions

### A. Dashboard (`/`)
- **Function**: Provides a high-level overview of the clinical portfolio.
- **Data Source**: 
  - Attempts to call `GET /api/dashboard/metrics`.
  - **Fallback**: If the API fails, it displays a hardcoded set of metrics (Quality: 86%, Operational: 72%, etc.).
- **Key Elements**:
  - **Stat Cards**: Active Studies, Open Queries, Tasks, Signals (Mock data).
  - **Clinical Studies List**: Hardcoded list of 4 studies (Diabetes, Rheumatoid Arthritis, etc.) with progress bars.
  - **Recent Activities**: A tabbed list of Tasks, Queries, and Signals. These are populated by constant arrays (`RECENT_TASKS`, `RECENT_QUERIES`) defined directly in the file.
  - **Protocol Deviations & SDTM Domains**: Hardcoded tables for visual demonstration.

### B. Data Manager AI (`/data-manager-ai`)
- **Function**: Demonstrates an AI-driven workflow for cleaning and reconciling data.
- **Data Source**: **100% Hardcoded / Mocked in the component Component**.
  - **No API calls** are made from this page.
- **Key Features**:
  - **Simulated Agents**: Visual cards for "Data Fetch Agent", "DQ Processing", etc.
  - **Activity Log**: A scrolling log (`[Apr 24, 2025...]`) that is a static array of strings. It does not reflect real backend activity.
  - **Interactive Demos**: 
    - "Run DQ and Reconciliation" button triggers a fake progress bar (`setTimeout` loop).
    - Study Dropdown switches between static datasets (PRO001, PRO002, PRO003) defined in the code.
  - **Tabs**: "DQ and Reconciliation", "Tasks", "Report", "Event Monitoring" - all filter local static arrays based on user selection.

### C. Other Pages
Most other pages follow a similar pattern: they contain the UI structure and layout but rely on internal constant data structures to render rows in tables and charts, ensuring the application "looks" functional without requiring a connected database.

---

## 5. Backend API Capabilities

Although the frontend often bypasses it, the backend exposes the following endpoints (via `backend/app/routers`):

- **Dashboard (`/api/dashboard`)**:
  - `/metrics`: Returns key performance indicators.
- **Studies (`/api/studies`)**:
  - GET `/`: List all studies.
  - POST `/`: Create a new study.
  - POST `/{id}/upload`: Upload protocol documents.
  - GET `/{id}/documents`: List documents for a study.
- **Data Manager (`/api/agents`)**: *Note: Wired in `api.ts` but unused in `DataManagerAI.tsx`*
  - GET `/agents`: Get agent status.
  - POST `/agents/{id}/refresh`: Trigger agent refresh.
  - GET `/activity-logs`: Get backend logs.
  - GET `/dq-issues`: Get data quality issues.
- **Integrations (`/api/integrations`)**:
  - GET `/`: List active integrations.

## 6. Conclusion
The application is a **high-fidelity prototype**. It is designed to visually demonstrate the *concept* of an AI-powered Clinical Data Management system. 
- **For Presentation**: It works perfectly "out of the box" because it doesn't strictly depend on the backend for its core "AI" demos.
- **For Development**: To make it real, you would need to:
    1.  Replace the static arrays in `DataManagerAI.tsx` with `useEffect` calls to the `dataManagerService`.
    2.  Implement the corresponding logic in `backend/app/routers/data_manager.py` to return dynamic data.
