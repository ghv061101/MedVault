import { useState, useEffect, useCallback } from "react";
import {
  getDocuments,
  uploadDocument,
  deleteDocument,
  getDocumentById,
  initializeSampleData,
} from "@/services/documentsApi";

export const useDocuments = () => {
  const [documents, setDocuments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize and fetch documents
  useEffect(() => {
    const init = async () => {
      try {
        initializeSampleData();
        const docs = await getDocuments();
        setDocuments(docs);
      } catch (error) {
        console.error("Failed to load documents:", error);
        setDocuments([]);
      } finally {
        setIsLoading(false);
      }
    };
    init();
  }, []);

  // POST /documents/upload
  const handleUpload = useCallback(async (file) => {
    try {
      const newDoc = await uploadDocument(file);
      setDocuments((prev) => [newDoc, ...prev]);
      return newDoc;
    } catch (error) {
      console.error("Upload failed:", error);
      throw error;
    }
  }, []);

  // DELETE /documents/:id
  const handleDelete = useCallback(async (id) => {
    try {
      const success = await deleteDocument(id);
      if (success) {
        setDocuments((prev) => prev.filter((doc) => doc.id !== id));
      }
      return success;
    } catch (error) {
      console.error("Delete failed:", error);
      throw error;
    }
  }, []);

  // GET /documents/:id (for download)
  const handleDownload = useCallback(async (doc) => {
    try {
      const document = await getDocumentById(doc.id);
      if (document) {
        console.log("Downloading:", document.filename);
      }
      return document;
    } catch (error) {
      console.error("Download failed:", error);
      throw error;
    }
  }, []);

  return {
    documents,
    isLoading,
    uploadDocument: handleUpload,
    deleteDocument: handleDelete,
    downloadDocument: handleDownload,
  };
};
