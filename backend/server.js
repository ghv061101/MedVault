import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { v4 as uuidv4 } from "uuid";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs/promises";
import {
  initializeDatabase,
  insertDocument,
  getAllDocuments,
  getDocumentById,
  deleteDocumentById,
  getDocumentCount,
} from "./db.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Setup file upload directory
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const uploadsDir = path.join(__dirname, "uploads");

// Ensure uploads directory exists
await fs.mkdir(uploadsDir, { recursive: true });

// Middleware
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(uploadsDir));

// Setup multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB limit
  fileFilter: (req, file, cb) => {
    const allowedMimes = [
      "application/pdf",
      "image/png",
      "image/jpeg",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Invalid file type"));
    }
  },
});

// Routes

// GET /api/documents - Get all documents
app.get("/api/documents", async (req, res) => {
  try {
    const documents = await getAllDocuments();
    res.json({
      success: true,
      data: documents,
      total: documents.length,
    });
  } catch (error) {
    console.error("Error fetching documents:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET /api/documents/:id - Get a single document and download
app.get("/api/documents/:id", async (req, res) => {
  try {
    const doc = await getDocumentById(req.params.id);
    if (!doc) {
      return res.status(404).json({ success: false, error: "Document not found" });
    }

    // If download query parameter is present, send file
    if (req.query.download === "true") {
      const filePath = path.join(uploadsDir, path.basename(doc.filepath));
      try {
        await fs.access(filePath);
        res.download(filePath, doc.filename);
      } catch (e) {
        return res.status(404).json({ success: false, error: "File not found on disk" });
      }
    } else {
      // Return document metadata
      res.json({ success: true, data: doc });
    }
  } catch (error) {
    console.error("Error fetching document:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// POST /api/documents/upload - Upload a new document
app.post("/api/documents/upload", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, error: "No file provided" });
    }

    const relativePath = path.join("uploads", req.file.filename);

    // Insert into database
    const newDoc = await insertDocument({
      filename: req.file.originalname,
      filepath: relativePath,
      filesize: req.file.size,
    });

    res.status(201).json({
      success: true,
      message: "Document uploaded successfully",
      data: newDoc,
    });
  } catch (error) {
    console.error("Error uploading document:", error);
    // Clean up uploaded file if DB insertion fails
    if (req.file) {
      try {
        await fs.unlink(path.join(uploadsDir, req.file.filename));
      } catch (e) {
        console.error("Error deleting uploaded file:", e);
      }
    }
    res.status(500).json({ success: false, error: error.message });
  }
});

// DELETE /api/documents/:id - Delete a document
app.delete("/api/documents/:id", async (req, res) => {
  try {
    const doc = await getDocumentById(req.params.id);
    if (!doc) {
      return res.status(404).json({ success: false, error: "Document not found" });
    }

    // Delete file from disk
    const filePath = path.join(uploadsDir, path.basename(doc.filepath));
    try {
      await fs.unlink(filePath);
    } catch (e) {
      console.log("File deletion skipped:", e.message);
    }

    // Delete from database
    await deleteDocumentById(req.params.id);

    res.json({
      success: true,
      message: "Document deleted successfully",
      data: {
        id: doc.id,
        filename: doc.filename,
      },
    });
  } catch (error) {
    console.error("Error deleting document:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    error: err.message || "Internal server error",
  });
});

// Start server
const startServer = async () => {
  try {
    await initializeDatabase();
    console.log("Database initialized successfully");

    app.listen(PORT, () => {
      console.log(`MedVault Backend running on http://localhost:${PORT}`);
      console.log(`File uploads directory: ${uploadsDir}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

startServer();
