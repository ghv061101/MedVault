# MedVault Backend

Node.js/Express API server for the MedVault document management system.

## Setup

```bash
cd backend
npm install
```

## Environment Variables

Create a `.env` file:

```
PORT=5000
NODE_ENV=development
```

## Run

Development (with auto-reload):
```bash
npm run dev
```

Production:
```bash
npm start
```

## API Endpoints

### GET /api/documents
Get all documents
```bash
curl http://localhost:5000/api/documents
```

### GET /api/documents/:id
Get a specific document
```bash
curl http://localhost:5000/api/documents/123
```

### POST /api/documents/upload
Upload a new document (multipart/form-data)
```bash
curl -F "file=@document.pdf" http://localhost:5000/api/documents/upload
```

### DELETE /api/documents/:id
Delete a document
```bash
curl -X DELETE http://localhost:5000/api/documents/123
```

### PUT /api/documents/:id
Update document metadata
```bash
curl -X PUT -H "Content-Type: application/json" \
  -d '{"type":"prescription"}' \
  http://localhost:5000/api/documents/123
```

## File Uploads

Uploaded files are stored in the `backend/uploads/` directory and served at `/uploads/<filename>`.

Allowed file types:
- PDF
- Images (PNG, JPEG)
- Word documents (DOC, DOCX)

Max file size: 50MB

## Features

- ✅ Document upload with multer
- ✅ Document listing and retrieval
- ✅ Document deletion with file cleanup
- ✅ Metadata updates
- ✅ CORS enabled for frontend communication
- ✅ Error handling
- ✅ File serving

## Next Steps

To use this backend with the frontend:

1. Update `src/services/documentsApi.js` to call the backend API instead of localStorage
2. Change the API base URL to `http://localhost:5000/api`
3. Connect with a database (MongoDB, PostgreSQL) instead of in-memory storage
