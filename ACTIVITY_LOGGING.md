# Activity Logging System

## Overview
The activity logging system tracks all user actions in the Clinical Cosmos application and displays them in the "Recent Activities" section of the dashboard.

## How It Works

### Backend
1. **Activity Model** (`app/models.py`)
   - Stores activity records in the `activities` table
   - Fields: `action_type`, `description`, `user_name`, `timestamp`, `related_entity_id`, `related_entity_type`

2. **Activity Router** (`app/routers/activities.py`)
   - `POST /api/activities/` - Log a new activity
   - `GET /api/activities/recent` - Get recent activities (default 10)
   - `GET /api/activities/` - Get all activities with pagination

3. **Auto-Logging in Operations**
   - Study creation
   - Study deletion
   - Document uploads

### Frontend
1. **Activity Service** (`clinical-cosmos-app/src/services/api.ts`)
   - `logActivity()` - Submit new activity
   - `getRecentActivities()` - Fetch recent activities
   - `getAllActivities()` - Fetch all activities

2. **Dashboard Integration** (`clinical-cosmos-app/src/pages/Dashboard.tsx`)
   - Fetches recent activities every 5 seconds
   - Displays in "All Activities" tab with icons, descriptions, users, and timestamps
   - Automatically refreshes when activities are logged

## Tracked Activities

### Study Management
- **study_created** - When a new study is created
- **study_deleted** - When a study is deleted

### Document Management
- **document_uploaded** - When a document is uploaded to a study

### Extensible
You can easily add more activity types by:
1. Calling `activityService.logActivity()` with appropriate parameters
2. Adding a handler in the `ActivityItem` component for the icon/label

## Example Usage

```typescript
// Log a query activity
await activityService.logActivity({
    action_type: "query_raised",
    description: "User raised a new query on study ST-ABC123",
    user_name: "User",
    related_entity_id: "ST-ABC123",
    related_entity_type: "query"
});

// Log a task closure
await activityService.logActivity({
    action_type: "task_closed",
    description: "Task 'Update protocol' marked as complete",
    user_name: "User",
    related_entity_id: "task_123",
    related_entity_type: "task"
});
```

## Database
The activities table is automatically created on application startup via the `@app.on_event("startup")` hook in `main.py`.

If you need to manually create or reset tables:
```bash
# From backend directory
python init_db.py          # Creates all tables
python add_activity_table.py  # Adds just the activities table
```

## Troubleshooting

### Activities not showing in dashboard
1. Check that the uvicorn server has restarted (should see "✓ Database tables initialized")
2. Verify the activities API endpoint is accessible: `curl http://localhost:8000/api/activities/recent`
3. Check browser console for API errors

### Delete study errors
The issue was that:
1. The Activity table didn't exist
2. Activity logging was attempted before DB operations

This has been fixed by:
1. Auto-creating tables on startup
2. Logging activity after successful deletion

### No recent activities on first load
The system starts fresh. Activities will appear as you:
- Create new studies
- Delete studies
- Upload documents
- Close tasks
- Raise queries
- Run DQ checks
