# Database Schema (NOT COMPLETED YET)

## Current Implementation

### studies
Stores core information about clinical studies.
- `id` (String, PK): Unique identifier, auto-generated (e.g., "ST-001").
- `title` (String, Index): Name of the clinical study.
- `protocol_id` (String): External protocol reference ID.
- `phase` (String): Study phase (Phase I - IV).
- `status` (String): Lifecycle status (Planning, Active, Completed, Hold).
- `sites_count` (Integer): Count of participating sites.
- `subjects_count` (Integer): Count of enrolled/planned subjects.
- `start_date` (Date): Study initiation date.
- `end_date` (Date, Nullable): Study completion date.
- `description` (String): Brief summary.
- `therapeutic_area` (String, Nullable): e.g., Oncology, Cardiology.
- `indication` (String, Nullable): Specific condition treated.
- `completion_percentage` (Integer): progress tracking (0-100).
- `file_url` (String, Nullable): Link to the primary protocol document (PDF).

### documents
Manages all files associated with a study (Protocols, IB, regulatory docs).
- `id` (Integer, PK): Auto-incrementing ID.
- `study_id` (String, FK -> studies.id): Parent study.
- `name` (String): Display name of the file.
- `type` (String): Application type (pdf, docx, csv).
- `source` (String): Origin ('Manual upload', 'eTMF Sync').
- `file_url` (String): Storage path or blob URL.
- `upload_date` (DateTime): Timestamp of creation.
- `version` (String): Version control tag (default "1.0").

### integrations
Configuration details for external system connectors.
- `id` (Integer, PK): Auto-incrementing ID.
- `name` (String): Display name (e.g., "Medidata Rave").
- `vendor` (String): Service provider.
- `type` (String): System category (EDC, CTMS, eTMF).
- `frequency` (String): Sync schedule (Daily, Real-time).
- `last_sync` (DateTime): Timestamp of last successful sync.
- `status` (String): Operational state (Connected, Error, Disabled).

### metrics
Key Performance Indicators for the dashboard.
- `key` (String, PK): Unique metric identifier (e.g., "data_quality").
- `value` (String): Display value (e.g., "86%").
- `label` (String): Human-readable title.
- `trend` (String, Nullable): Directional indicator ("up", "down", "stable").

---

## Planned Schema (Future Implementation)

Based on UI requirements and Scraped Pages analysis.

### risk_profiles
To support `risk-profiles.html`.
- `id` (Integer, PK)
- `entity_type` (String): "Site", "Trial", "Vendor", "Resource".
- `entity_name` (String): Name of the specific entity.
- `risk_score` (Integer): calculated risk value (0-100).
- `category` (String): Risk category (Safety, Compliance, Quality).
- `trend` (String): Risk trend over time.

### signals
To support `signal-detection.html`.
- `id` (Integer, PK)
- `name` (String): Signal name.
- `severity` (String): "Critical", "Major", "Minor".
- `status` (String): "New", "Investigating", "Resolved".
- `detected_date` (DateTime)
- `description` (String)

### tasks
To support `tasks.html`.
- `id` (Integer, PK)
- `title` (String)
- `assignee` (String)
- `due_date` (Date)
- `status` (String): "To Do", "In Progress", "Done".
- `priority` (String): "High", "Medium", "Low".

### notifications
To support `notifications.html`.
- `id` (Integer, PK)
- `user_id` (Integer, FK): Recipient.
- `message` (String)
- `read` (Boolean): Read status.
- `timestamp` (DateTime)

## Entity Relationships
- **Study** (1) <-> (N) **Document** (`cascade="all, delete-orphan"`)
- **Study** (1) <-> (N) **RiskProfile** (Proposed)
- **Study** (1) <-> (N) **Task** (Proposed)
