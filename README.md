# PDF File Management System

A modern web application for uploading, storing, and managing PDF documents with a React frontend and Express.js backend, powered by SQLite database.

## 📋 Project Overview

**MedVault** is a document management system that allows users to:
- ✅ Upload PDF documents
- ✅ View all uploaded documents with metadata
- ✅ Download documents
- ✅ Delete documents
- ✅ Track file sizes and upload timestamps

### Key Features

- **Frontend**: React + Vite with modern UI components (shadcn/ui, Tailwind CSS)
- **Backend**: Express.js REST API with file upload handling
- **Database**: SQLite3 for persistent data storage
- **File Storage**: Local filesystem with unique file naming
- **CORS**: Enabled for cross-origin requests during development

---

## 🛠️ Tech Stack

### Frontend
- **React 18** - UI framework
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Styling
- **shadcn/ui** - Component library
- **Axios/Fetch API** - HTTP client

### Backend
- **Node.js** - Runtime
- **Express.js** - Web framework
- **Multer** - File upload middleware
- **SQLite3** - Database
- **CORS** - Cross-origin handling

### Database
- **SQLite3** - Lightweight, file-based database
- **Schema**: documents table with id, filename, filepath, filesize, created_at

---

## 📁 Project Structure

```
project-root/
├── src/                          # Frontend source code
│   ├── components/
│   │   ├── DocumentList.jsx      # Display documents
│   │   ├── UploadZone.jsx        # File upload interface
│   │   ├── Header.jsx            # App header
│   │   ├── StatsBar.jsx          # Statistics display
│   │   └── ui/                   # shadcn/ui components
│   ├── hooks/
│   │   ├── useDocuments.js       # Documents state management
│   │   └── use-toast.js          # Toast notifications
│   ├── services/
│   │   └── documentsApi.js       # API calls
│   ├── pages/
│   │   ├── Documents.jsx
│   │   ├── DocumentsView.jsx
│   │   ├── Index.jsx
│   │   └── NotFound.jsx
│   ├── App.jsx                   # Main app component
│   └── main.jsx                  # Entry point
│
├── backend/                      # Backend source code
│   ├── server.js                 # Express server and routes
│   ├── db.js                     # Database module
│   ├── database.db               # SQLite database (auto-created)
│   ├── uploads/                  # Uploaded files directory
│   ├── package.json
│   └── README.md
│
├── public/                       # Static assets
├── design.md                     # Architecture & design documentation
├── vite.config.js               # Vite configuration
├── jsconfig.json                # JavaScript config
├── package.json                 # Root dependencies
└── README.md                    # This file
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** (v16 or higher)
- **npm** (comes with Node.js)
- **Git**

### Installation

#### 1. Clone the Repository
```bash
git clone https://github.com/ghv061101/MedVault.git
cd MedVault
```

#### 2. Install Frontend Dependencies
```bash
npm install
```

#### 3. Install Backend Dependencies
```bash
cd backend
npm install
cd ..
```

---

## 💻 Running Locally

### Option 1: Run Both Frontend & Backend (Recommended)

#### Terminal 1 - Start Backend
```bash
cd backend
npm start
```
Backend will run on `http://localhost:5000`

Expected output:
```
Connected to SQLite database at: .../database.db
Documents table initialized
Database indexes created
Database initialized successfully
MedVault Backend running on http://localhost:5000
File uploads directory: .../backend/uploads
```

#### Terminal 2 - Start Frontend
```bash
npm run dev
```
Frontend will run on `http://localhost:5175` (or next available port)

Expected output:
```
VITE v7.2.4 ready in XXX ms
➜ Local: http://localhost:5175/
```

### Option 2: Run Backend Only (API Testing)
```bash
cd backend
npm start
```

This is useful for testing APIs with cURL or Postman.

### Option 3: Development Mode (with auto-reload)
```bash
# Backend with auto-reload
cd backend
npm run dev

# Frontend with auto-reload (in another terminal)
npm run dev
```

---

## 📡 API Endpoints

### Base URL
```
http://localhost:5000/api
```

### 1. Upload Document

**Endpoint:** `POST /documents/upload`

**Description:** Upload a PDF file and store metadata in database

**Request:**
```bash
curl -X POST http://localhost:5000/api/documents/upload \
  -F "file=@./document.pdf"
```

**Response (Success - 201):**
```json
{
  "success": true,
  "message": "Document uploaded successfully",
  "data": {
    "id": 1,
    "filename": "document.pdf",
    "filepath": "uploads/1702303200000-document.pdf",
    "filesize": 102400,
    "created_at": "2025-12-11T10:30:00.000Z"
  }
}
```

**Response (Error - 400):**
```json
{
  "success": false,
  "error": "No file provided"
}
```

---

### 2. List All Documents

**Endpoint:** `GET /documents`

**Description:** Retrieve all uploaded documents with metadata

**Request:**
```bash
curl -X GET http://localhost:5000/api/documents
```

**Response (Success - 200):**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "filename": "document.pdf",
      "filepath": "uploads/1702303200000-document.pdf",
      "filesize": 102400,
      "created_at": "2025-12-11T10:30:00.000Z"
    },
    {
      "id": 2,
      "filename": "report.pdf",
      "filepath": "uploads/1702303300000-report.pdf",
      "filesize": 256000,
      "created_at": "2025-12-11T10:35:00.000Z"
    }
  ],
  "total": 2
}
```

---

### 3. Get Document Metadata

**Endpoint:** `GET /documents/:id`

**Description:** Get metadata for a specific document

**Request:**
```bash
curl -X GET http://localhost:5000/api/documents/1
```

**Response (Success - 200):**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "filename": "document.pdf",
    "filepath": "uploads/1702303200000-document.pdf",
    "filesize": 102400,
    "created_at": "2025-12-11T10:30:00.000Z"
  }
}
```

**Download File:**
```bash
curl -X GET "http://localhost:5000/api/documents/1?download=true" \
  -o downloaded_document.pdf
```

**Response (Error - 404):**
```json
{
  "success": false,
  "error": "Document not found"
}
```

---

### 4. Delete Document

**Endpoint:** `DELETE /documents/:id`

**Description:** Delete a document (removes file and metadata from database)

**Request:**
```bash
curl -X DELETE http://localhost:5000/api/documents/1
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
  "error": "Document not found"
}
```

---

## 🧪 Testing API Endpoints

### Using cURL

#### Upload a file:
```bash
curl -X POST http://localhost:5000/api/documents/upload \
  -F "file=@C:/path/to/sample.pdf"
```

#### List all documents:
```bash
curl -X GET http://localhost:5000/api/documents
```

#### Get single document:
```bash
curl -X GET http://localhost:5000/api/documents/1
```

#### Download file:
```bash
curl -X GET "http://localhost:5000/api/documents/1?download=true" \
  -o document.pdf
```

#### Delete document:
```bash
curl -X DELETE http://localhost:5000/api/documents/1
```

### Using Postman

1. **Import Collection:**
   - Create new Request
   - Set URL: `http://localhost:5000/api/documents`
   - Set Method: `GET`
   - Click Send

2. **Upload File:**
   - Method: `POST`
   - URL: `http://localhost:5000/api/documents/upload`
   - Body: form-data
   - Key: `file`, Value: Select file
   - Click Send

3. **Delete:**
   - Method: `DELETE`
   - URL: `http://localhost:5000/api/documents/1`
   - Click Send

### Using JavaScript/Fetch

```javascript
// Upload a file
const formData = new FormData();
formData.append('file', fileInput.files[0]);

const uploadResponse = await fetch('http://localhost:5000/api/documents/upload', {
  method: 'POST',
  body: formData
});
const result = await uploadResponse.json();
console.log(result);

// Get all documents
const getResponse = await fetch('http://localhost:5000/api/documents');
const documents = await getResponse.json();
console.log(documents);

// Delete document
const deleteResponse = await fetch('http://localhost:5000/api/documents/1', {
  method: 'DELETE'
});
const deleteResult = await deleteResponse.json();
console.log(deleteResult);
```

---

## 📊 Database Schema

### documents Table

```sql
CREATE TABLE documents (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  filename TEXT NOT NULL,
  filepath TEXT NOT NULL UNIQUE,
  filesize INTEGER NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_created_at ON documents(created_at);
CREATE INDEX idx_filepath ON documents(filepath);
```

**Fields:**
- `id` - Auto-incrementing primary key
- `filename` - Original filename
- `filepath` - Relative path to stored file
- `filesize` - File size in bytes
- `created_at` - Timestamp when file was uploaded

---

## 🔒 Configuration

### Environment Variables

Create a `.env` file in the backend directory:

```env
PORT=5000
NODE_ENV=development
```

---

## 📈 Scaling Considerations

For deploying to production with 1000+ users, consider:

1. **Database**: Migrate from SQLite to PostgreSQL
2. **File Storage**: Use AWS S3 or Google Cloud Storage
3. **CDN**: CloudFlare or AWS CloudFront for downloads
4. **Authentication**: Add JWT or OAuth
5. **Caching**: Redis for frequently accessed files
6. **Load Balancing**: PM2, Nginx, or AWS ALB
7. **Logging**: ELK Stack or Datadog
8. **Monitoring**: Error tracking with Sentry

See `design.md` for detailed architecture and scaling strategy.

---

## 🐛 Troubleshooting

### Backend won't start
```bash
# Check if port 5000 is in use
netstat -ano | findstr :5000

# Kill the process (Windows)
taskkill /PID <PID> /F

# Restart backend
cd backend && npm start
```

### Database errors
```bash
# Delete the database to reset
rm backend/database.db

# Restart backend (will create new database)
cd backend && npm start
```

### CORS errors
- Backend has CORS enabled by default
- Check frontend is making requests to `http://localhost:5000`

### File upload fails
- Ensure `backend/uploads/` directory exists
- Check file size is under 50MB
- Verify file is a valid PDF

---

## 📚 Documentation

- **Architecture & Design**: See `design.md` for tech stack choices, architecture overview, API specifications, and assumptions
- **Database Implementation**: See `DATABASE_IMPLEMENTATION.md` for database setup details

---

## 📝 Project Features

✅ **Frontend**
- React components for document management
- File upload with drag-and-drop
- Document list with details
- Download and delete functionality
- Responsive UI with Tailwind CSS

✅ **Backend**
- RESTful API endpoints
- File upload handling with Multer
- SQLite database integration
- CORS middleware
- Error handling and logging

✅ **Database**
- SQLite3 database
- Automatic schema initialization
- Indexed queries for performance
- Unique file path constraints

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the ISC License - see the LICENSE file for details.

---

## 👤 Author

**GitHub:** [@ghv061101](https://github.com/ghv061101)

**Repository:** [MedVault](https://github.com/ghv061101/MedVault)

---

## 🙏 Acknowledgments

- Built with React, Express, and SQLite
- UI components from shadcn/ui
- Styling with Tailwind CSS
- File handling with Multer

---

## 📞 Support

For issues, questions, or suggestions, please open an issue on GitHub or contact the maintainer.

---

**Last Updated:** December 11, 2025
**Version:** 1.0.0
#   M e d V a u l t 
 
 