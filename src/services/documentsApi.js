const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

// GET /documents
export const getDocuments = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/documents`);
    if (!response.ok) throw new Error(`HTTP ${response.status}: Failed to fetch documents`);
    const data = await response.json();
    return data.data || [];
  } catch (error) {
    console.error("getDocuments error:", error);
    throw error;
  }
};

// GET /documents/:id
export const getDocumentById = async (id) => {
  try {
    const response = await fetch(`${API_BASE_URL}/documents/${id}`);
    if (!response.ok) throw new Error(`HTTP ${response.status}: Document not found`);
    const data = await response.json();
    return data.data || null;
  } catch (error) {
    console.error("getDocumentById error:", error);
    throw error;
  }
};

// POST /documents/upload
export const uploadDocument = async (file, userId = "user1") => {
  try {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("userId", userId);

    const response = await fetch(`${API_BASE_URL}/documents/upload`, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) throw new Error(`HTTP ${response.status}: Upload failed`);
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error("uploadDocument error:", error);
    throw error;
  }
};

// DELETE /documents/:id
export const deleteDocument = async (id) => {
  try {
    const response = await fetch(`${API_BASE_URL}/documents/${id}`, {
      method: "DELETE",
    });

    if (!response.ok) throw new Error(`HTTP ${response.status}: Delete failed`);
    const data = await response.json();
    return data.success;
  } catch (error) {
    console.error("deleteDocument error:", error);
    throw error;
  }
};

// PUT /documents/:id (update metadata)
export const updateDocument = async (id, updates) => {
  try {
    const response = await fetch(`${API_BASE_URL}/documents/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updates),
    });

    if (!response.ok) throw new Error(`HTTP ${response.status}: Update failed`);
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error("updateDocument error:", error);
    throw error;
  }
};

// Initialize sample data (not needed with backend, but kept for compatibility)
export const initializeSampleData = async () => {
  // Backend initializes with sample data on startup
  return true;
};
