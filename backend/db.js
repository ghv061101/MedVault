import sqlite3 from "sqlite3";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dbPath = path.join(__dirname, "database.db");

// Create database connection
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error("Error opening database:", err.message);
  } else {
    console.log("Connected to SQLite database at:", dbPath);
  }
});

// Enable foreign keys
db.run("PRAGMA foreign_keys = ON");

/**
 * Initialize database schema
 */
export const initializeDatabase = () => {
  return new Promise((resolve, reject) => {
    // Create documents table
    db.run(
      `
      CREATE TABLE IF NOT EXISTS documents (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        filename TEXT NOT NULL,
        filepath TEXT NOT NULL UNIQUE,
        filesize INTEGER NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `,
      (err) => {
        if (err) {
          console.error("Error creating documents table:", err.message);
          reject(err);
        } else {
          console.log("Documents table initialized");
        }
      }
    );

    // Create indexes
    db.run(
      `CREATE INDEX IF NOT EXISTS idx_created_at ON documents(created_at)`,
      (err) => {
        if (err) console.error("Error creating index idx_created_at:", err);
      }
    );

    db.run(
      `CREATE INDEX IF NOT EXISTS idx_filepath ON documents(filepath)`,
      (err) => {
        if (err) {
          console.error("Error creating index idx_filepath:", err);
          reject(err);
        } else {
          console.log("Database indexes created");
          resolve();
        }
      }
    );
  });
};

/**
 * Insert a new document record
 * @param {Object} document - { filename, filepath, filesize }
 * @returns {Promise}
 */
export const insertDocument = (document) => {
  return new Promise((resolve, reject) => {
    const { filename, filepath, filesize } = document;

    db.run(
      `INSERT INTO documents (filename, filepath, filesize, created_at)
       VALUES (?, ?, ?, CURRENT_TIMESTAMP)`,
      [filename, filepath, filesize],
      function (err) {
        if (err) {
          reject(err);
        } else {
          resolve({
            id: this.lastID,
            filename,
            filepath,
            filesize,
            created_at: new Date().toISOString(),
          });
        }
      }
    );
  });
};

/**
 * Get all documents
 * @returns {Promise<Array>}
 */
export const getAllDocuments = () => {
  return new Promise((resolve, reject) => {
    db.all(
      `SELECT * FROM documents ORDER BY created_at DESC`,
      (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows || []);
        }
      }
    );
  });
};

/**
 * Get a document by ID
 * @param {number} id
 * @returns {Promise}
 */
export const getDocumentById = (id) => {
  return new Promise((resolve, reject) => {
    db.get(
      `SELECT * FROM documents WHERE id = ?`,
      [id],
      (err, row) => {
        if (err) {
          reject(err);
        } else {
          resolve(row);
        }
      }
    );
  });
};

/**
 * Get a document by filepath
 * @param {string} filepath
 * @returns {Promise}
 */
export const getDocumentByFilepath = (filepath) => {
  return new Promise((resolve, reject) => {
    db.get(
      `SELECT * FROM documents WHERE filepath = ?`,
      [filepath],
      (err, row) => {
        if (err) {
          reject(err);
        } else {
          resolve(row);
        }
      }
    );
  });
};

/**
 * Delete a document by ID
 * @param {number} id
 * @returns {Promise}
 */
export const deleteDocumentById = (id) => {
  return new Promise((resolve, reject) => {
    db.run(
      `DELETE FROM documents WHERE id = ?`,
      [id],
      function (err) {
        if (err) {
          reject(err);
        } else {
          resolve({
            success: true,
            changes: this.changes,
          });
        }
      }
    );
  });
};

/**
 * Get document count
 * @returns {Promise<number>}
 */
export const getDocumentCount = () => {
  return new Promise((resolve, reject) => {
    db.get(
      `SELECT COUNT(*) as count FROM documents`,
      (err, row) => {
        if (err) {
          reject(err);
        } else {
          resolve(row.count);
        }
      }
    );
  });
};

/**
 * Close database connection
 */
export const closeDatabase = () => {
  return new Promise((resolve, reject) => {
    db.close((err) => {
      if (err) {
        reject(err);
      } else {
        console.log("Database connection closed");
        resolve();
      }
    });
  });
};

export default db;
