# PDF File Management System - Design Documentation

---

## Part 1: Design & Architecture

### 1. Tech Stack Choices

#### Q1. What frontend framework did you use and why? (React, Vue, etc.)

**Answer: React (via Vite)**

We chose **React** as the frontend framework because:
- **Component-based architecture**: Makes it easy to build reusable UI components (DocumentList, UploadZone, Header, etc.)
- **Rich ecosystem**: Extensive libraries available for routing, state management, and UI components
- **Performance**: Virtual DOM provides efficient rendering
- **Developer experience**: Large community, excellent tooling, and easy debugging
- **Vite for bundling**: Provides fast development server and optimized production builds
- **Integration with UI libraries**: Works seamlessly with shadcn/ui for professional components

---

#### Q2. What backend framework did you choose and why? (Express, Flask, Django, etc.)

**Answer: Node.js with Express**

We chose **Express.js** because:
- **Lightweight & fast**: Minimal overhead with excellent performance for file handling
- **JavaScript ecosystem**: Allows code reuse between frontend and backend (same language)
- **Middleware support**: Powerful middleware system for request handling (CORS, multipart/form-data, etc.)
- **File handling**: Excellent libraries like `multer` for handling file uploads
- **Scalability**: Non-blocking I/O model handles concurrent requests efficiently
- **Deployment**: Easy to deploy on various platforms (Heroku, DigitalOcean, AWS, etc.)
- **Development speed**: Rapid prototyping with minimal boilerplate

---

#### Q3. What database did you choose and why? (SQLite vs PostgreSQL vs others)

**Answer: SQLite (with potential for PostgreSQL scaling)**

We chose **SQLite** for initial development because:
- **Zero setup**: No separate database server required
- **File-based**: Easy to back up and deploy
- **Perfect for MVP**: Sufficient for single-user and small-team scenarios
- **Development ease**: Works without installation or configuration
- **Lightweight**: Ideal for embedded database scenarios

**Note**: For production with multiple concurrent users, we recommend migrating to **PostgreSQL** because:
- Better concurrency handling than SQLite
- ACID compliance with multi-user support
- Horizontal scalability
- Advanced features (transactions, constraints, indexes)

---

#### Q4. If you were to support 1,000 users, what changes would you consider?

**Scaling Considerations:**

1. **Database Layer**
   - Migrate from SQLite to **PostgreSQL** for better concurrency
   - Implement connection pooling (e.g., pgBouncer)
   - Add database indexes on frequently queried fields (id, created_at, user_id)
   - Implement pagination for large document lists

2. **File Storage**
   - Move from local filesystem to **cloud storage** (AWS S3, Google Cloud Storage, Azure Blob)
   - Implement CDN for faster file downloads
   - Add file compression and deduplication for storage optimization

3. **Authentication & Authorization**
   - Add **JWT-based authentication**
   - Implement user-specific document access control
   - Add role-based access control (RBAC)

4. **Backend Infrastructure**
   - Load balancing with multiple Express instances (e.g., using PM2)
   - Implement caching layer (Redis) for frequently accessed documents
   - Use message queues (RabbitMQ, Redis) for async file processing
   - Add microservices for file processing/conversion if needed

5. **API Rate Limiting**
   - Implement rate limiting to prevent abuse
   - Add request validation and sanitization

6. **Monitoring & Logging**
   - Centralized logging (ELK, Datadog, New Relic)
   - Performance monitoring and alerting
   - Error tracking (Sentry)

7. **Security**
   - Implement HTTPS/TLS
   - Add CSRF protection
   - File virus scanning
   - Input validation and SQL injection prevention

8. **Frontend Optimization**
   - Code splitting and lazy loading
   - Service workers for offline support
   - Image/file compression before upload

---

### 2. Architecture Overview

#### System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                     CLIENT (Browser)                         │
│  ┌──────────────────────────────────────────────────────┐   │
│  │         React Frontend (Vite)                        │   │
│  │  - DocumentList (displays files)                     │   │
│  │  - UploadZone (file upload interface)                │   │
│  │  - StatsBar (statistics display)                     │   │
│  │  - Download & Delete functionality                  │   │
│  └──────────────────────────────────────────────────────┘   │
└────────────────────┬────────────────────────────────────────┘
                     │ HTTP/REST API
                     │ (Axios/Fetch)
                     ↓
┌─────────────────────────────────────────────────────────────┐
│              EXPRESS SERVER (Node.js Backend)               │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  API Routes                                          │   │
│  │  - POST /documents/upload                            │   │
│  │  - GET /documents                                    │   │
│  │  - GET /documents/:id                                │   │
│  │  - DELETE /documents/:id                             │   │
│  └──────────────────────────────────────────────────────┘   │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  Middleware                                          │   │
│  │  - CORS handling                                     │   │
│  │  - Multer (file upload processing)                   │   │
│  │  - Error handling                                    │   │
│  └──────────────────────────────────────────────────────┘   │
└────┬──────────────────────────────┬───────────────────────┬─┘
     │                              │                       │
     ↓                              ↓                       ↓
┌─────────────────┐     ┌──────────────────┐    ┌──────────────────┐
│   SQLite DB     │     │   Local Storage  │    │  Uploads Folder  │
│  (database.db)  │     │  (File Metadata) │    │  (PDF files)     │
│  ┌─────────────┐│     └──────────────────┘    │  ┌────────────┐  │
│  │ documents   ││                             │  │ file1.pdf  │  │
│  │ table       ││                             │  │ file2.pdf  │  │
│  └─────────────┘│                             │  └────────────┘  │
└─────────────────┘                             └──────────────────┘
```

#### Data Flow

**Upload Flow:**
1. User selects PDF in frontend
2. Frontend validates file (type, size)
3. Frontend sends multipart form data to `/documents/upload`
4. Backend (Multer) saves file to `uploads/` folder
5. Backend extracts metadata (filename, filesize)
6. Backend stores metadata in SQLite database
7. Backend returns file info and download link to frontend
8. Frontend displays file in document list

**Download Flow:**
1. User clicks download button on a document
2. Frontend sends GET request to `/documents/:id`
3. Backend queries database to get filepath
4. Backend streams file from `uploads/` folder
5. Browser receives file and triggers download

**Deletion Flow:**
1. User clicks delete button on a document
2. Frontend sends DELETE request to `/documents/:id`
3. Backend queries database to get filepath
4. Backend deletes file from `uploads/` folder
5. Backend deletes record from database
6. Frontend removes document from list

---

### 3. API Specification

#### Endpoint 1: Upload Document

**URL:** `POST /documents/upload`

**Description:** Upload a PDF file and store metadata in database

**Request:**
```
Method: POST
URL: http://localhost:5000/documents/upload
Content-Type: multipart/form-data

Body:
- file: <PDF file binary>
```

**Request Example (cURL):**
```bash
curl -X POST http://localhost:5000/documents/upload \
  -F "file=@/path/to/document.pdf"
```

**Response (Success - 200):**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "filename": "document.pdf",
    "filesize": 102400,
    "filepath": "uploads/1702303200000-document.pdf",
    "created_at": "2025-12-11T10:30:00.000Z"
  }
}
```

**Response (Error - 400):**
```json
{
  "success": false,
  "message": "No file uploaded",
  "error": "FILE_REQUIRED"
}
```

---

#### Endpoint 2: List All Documents

**URL:** `GET /documents`

**Description:** Retrieve all uploaded documents with metadata

**Request:**
```
Method: GET
URL: http://localhost:5000/documents
```

**Request Example (cURL):**
```bash
curl -X GET http://localhost:5000/documents
```

**Response (Success - 200):**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "filename": "document.pdf",
      "filesize": 102400,
      "filepath": "uploads/1702303200000-document.pdf",
      "created_at": "2025-12-11T10:30:00.000Z"
    },
    {
      "id": 2,
      "filename": "report.pdf",
      "filesize": 256000,
      "filepath": "uploads/1702303300000-report.pdf",
      "created_at": "2025-12-11T10:35:00.000Z"
    }
  ],
  "total": 2
}
```

**Response (Error - 500):**
```json
{
  "success": false,
  "message": "Failed to retrieve documents",
  "error": "DATABASE_ERROR"
}
```

---

#### Endpoint 3: Download File

**URL:** `GET /documents/:id`

**Description:** Download a specific document by ID

**Request:**
```
Method: GET
URL: http://localhost:5000/documents/1
```

**Request Example (cURL):**
```bash
curl -X GET http://localhost:5000/documents/1 \
  -o downloaded_file.pdf
```

**Response (Success - 200):**
```
Content-Type: application/pdf
Content-Disposition: attachment; filename="document.pdf"
Body: <PDF file binary>
```

**Response (Error - 404):**
```json
{
  "success": false,
  "message": "Document not found",
  "error": "NOT_FOUND"
}
```

---

#### Endpoint 4: Delete File

**URL:** `DELETE /documents/:id`

**Description:** Delete a document by ID (removes file and metadata)

**Request:**
```
Method: DELETE
URL: http://localhost:5000/documents/1
```

**Request Example (cURL):**
```bash
curl -X DELETE http://localhost:5000/documents/1
```

**Response (Success - 200):**
```json
{
  "success": true,
  "message": "Document deleted successfully",
  "data": {
    "id": 1,
    "filename": "document.pdf"
  }
}
```

**Response (Error - 404):**
```json
{
  "success": false,
  "message": "Document not found",
  "error": "NOT_FOUND"
}
```

**Response (Error - 500):**
```json
{
  "success": false,
  "message": "Failed to delete document",
  "error": "DELETE_FAILED"
}
```

---

### 4. Data Flow Description

#### Q5. Describe the step-by-step process of what happens when a file is uploaded and when it is downloaded.

**Upload Process:**

1. **Frontend Validation**
   - User selects a PDF file via the UploadZone component
   - Frontend validates: file type (must be PDF), file size (< 50MB typical)
   - If validation fails, error is shown to user

2. **File Preparation**
   - Frontend creates FormData object
   - Appends file to FormData
   - Frontend shows loading indicator/spinner

3. **Network Transfer**
   - Frontend sends POST request to `http://localhost:5000/documents/upload`
   - Request includes multipart/form-data with file binary

4. **Backend Reception (Multer)**
   - Express receives request
   - Multer middleware intercepts the multipart request
   - File is stored in memory or disk (based on configuration)
   - File is saved to `uploads/` folder with unique timestamp filename
   - Example: `uploads/1702303200000-document.pdf`

5. **Metadata Extraction**
   - Backend extracts metadata:
     - Original filename: `document.pdf`
     - File size: `102400` bytes
     - File path: `uploads/1702303200000-document.pdf`
     - Timestamp: `2025-12-11T10:30:00.000Z`

6. **Database Storage**
   - Backend inserts record into SQLite `documents` table:
     ```sql
     INSERT INTO documents (filename, filepath, filesize, created_at)
     VALUES ('document.pdf', 'uploads/1702303200000-document.pdf', 102400, datetime('now'))
     ```

7. **Response**
   - Backend returns success response with document ID and metadata
   - Frontend receives response, stores document info in state
   - Frontend adds document to the DocumentList display
   - Loading indicator is hidden, success message shown

8. **UI Update**
   - Document appears in the list with download/delete buttons
   - File size is formatted (e.g., "100 KB")
   - Upload date is displayed

---

**Download Process:**

1. **User Action**
   - User clicks "Download" button on a document in DocumentList
   - Button passes document ID (e.g., `1`) to download handler

2. **Backend Query**
   - Frontend sends GET request to `http://localhost:5000/documents/1`
   - Backend receives request with document ID

3. **Database Lookup**
   - Backend queries SQLite for document with ID = 1
   - Returns: filepath, filename, and other metadata
   - If not found, returns 404 error

4. **File Retrieval**
   - Backend retrieves file from filesystem at `uploads/1702303200000-document.pdf`
   - Checks if file exists
   - If missing, returns error (file was deleted externally)

5. **Stream Preparation**
   - Backend sets response headers:
     - `Content-Type: application/pdf`
     - `Content-Disposition: attachment; filename="document.pdf"`
     - `Content-Length: 102400`

6. **File Transmission**
   - Backend creates read stream from file
   - Streams file data through HTTP response
   - Browser receives binary PDF data

7. **Browser Handling**
   - Browser recognizes `Content-Disposition: attachment`
   - Triggers download dialog
   - File is saved with original filename: `document.pdf`
   - Download complete

---

### 5. Assumptions

#### Q6. What assumptions did you make while building this? (e.g., file size limits, authentication, concurrency)

**Assumptions Made:**

1. **File Size Limits**
   - Assumed maximum file size: **50 MB** per upload
   - Rationale: Balances functionality with server resources
   - Multer configured with `limits: { fileSize: 50 * 1024 * 1024 }`

2. **File Types**
   - Only PDF files allowed (`application/pdf` MIME type)
   - Frontend validates file extension and MIME type
   - Backend double-checks MIME type for security

3. **Authentication**
   - **No authentication implemented** in MVP
   - Assumption: This is a local/internal tool or demo
   - All users share the same file storage
   - For production, would add JWT/OAuth authentication

4. **Concurrency**
   - Assumed low to moderate concurrency (<100 concurrent users initially)
   - Express can handle multiple simultaneous requests via event loop
   - For 1000+ users, would implement load balancing

5. **Storage**
   - Files stored locally in `uploads/` folder
   - Assumption: Limited storage (~10-50GB available)
   - Metadata stored in single SQLite database file
   - For distributed systems, would migrate to cloud storage (S3)

6. **File Uniqueness**
   - Multiple users can upload files with same name
   - Files are renamed with timestamp to ensure uniqueness
   - Example: `1702303200000-document.pdf`
   - Assumption: Timestamp collisions are negligible

7. **Data Persistence**
   - Database persists locally (SQLite file in project directory)
   - No backup strategy implemented
   - Assumption: Acceptable for development/demo
   - For production, implement automated backups

8. **Network Assumptions**
   - Assumption: Stable, reasonably fast network connection
   - No retry logic for failed uploads
   - No chunked/resumable uploads for large files

9. **Browser Compatibility**
   - Target modern browsers (Chrome, Firefox, Safari, Edge)
   - Assumes ES6+ JavaScript support
   - No IE11 support

10. **Performance Assumptions**
    - Single server instance adequate for current scale
    - No database replication or clustering
    - No caching layer (Redis)
    - Response times <1s for typical operations

11. **Security Assumptions**
    - Runs on trusted local network or internal server
    - No HTTPS/TLS enforced in development
    - File uploads not scanned for malware
    - No rate limiting implemented
    - SQL injection mitigated through parameterized queries

12. **Directory Structure**
    - Uploads folder (`backend/uploads/`) exists and is writable
    - Database file created at `backend/database.db`
    - No permission restrictions within application

13. **Error Handling**
    - Graceful error responses for common scenarios
    - No detailed error logs for debugging
    - User-friendly error messages displayed

14. **Deletion**
    - Hard delete: once deleted, files cannot be recovered
    - No soft delete or trash/recycle bin
    - No audit trail of deletions

---

## Part 2: Implementation Details

### Database Schema

**Table: documents**

```sql
CREATE TABLE documents (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  filename TEXT NOT NULL,
  filepath TEXT NOT NULL UNIQUE,
  filesize INTEGER NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

**Indexes:**
```sql
CREATE INDEX idx_created_at ON documents(created_at);
CREATE INDEX idx_filepath ON documents(filepath);
```

---

### Project Structure

```
project-root/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── DocumentList.jsx
│   │   │   ├── UploadZone.jsx
│   │   │   ├── Header.jsx
│   │   │   └── StatsBar.jsx
│   │   ├── hooks/
│   │   │   ├── useDocuments.js
│   │   │   └── use-toast.js
│   │   ├── services/
│   │   │   └── documentsApi.js
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── vite.config.js
│   └── package.json
│
├── backend/
│   ├── server.js
│   ├── database.db (created on first run)
│   ├── uploads/ (file storage)
│   ├── package.json
│   └── routes/ (API routes)
│
├── design.md (this file)
├── README.md
└── package.json (root)
```

---

## Technology Stack Summary

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Frontend** | React + Vite | UI framework and bundler |
| **UI Components** | shadcn/ui + Tailwind CSS | Styling and component library |
| **State Management** | React Hooks | Local state management |
| **HTTP Client** | Axios / Fetch API | API communication |
| **Backend** | Express.js (Node.js) | REST API server |
| **File Upload** | Multer | Multipart form data handling |
| **Database** | SQLite3 | Local data persistence |
| **Validation** | Express validators | Input validation |

---

**Document Created:** December 11, 2025
**Project:** PDF File Management System
**Status:** Design & Architecture Documentation Complete
