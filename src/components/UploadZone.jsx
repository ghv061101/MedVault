import { useState, useRef, useCallback } from "react";
import { Upload, FileUp, X, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";

const UploadZone = ({ onUpload }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [error, setError] = useState(null);
  const inputRef = useRef(null);

  const validateFile = (file) => {
    setError(null);
    
    const allowedTypes = ["application/pdf", "image/png", "image/jpeg", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"];
    if (!allowedTypes.includes(file.type)) {
      setError("Only PDF, images (PNG/JPEG), and Word documents are allowed");
      return false;
    }
    
    if (file.size > 50 * 1024 * 1024) {
      setError("File size must be less than 50MB");
      return false;
    }
    
    return true;
  };

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
    
    const file = e.dataTransfer.files[0];
    if (file && validateFile(file)) {
      setSelectedFile(file);
    }
  }, []);

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (file && validateFile(file)) {
      setSelectedFile(file);
    }
  };

  const handleUpload = async () => {
    if (selectedFile) {
      try {
        await onUpload(selectedFile);
        setSelectedFile(null);
        if (inputRef.current) {
          inputRef.current.value = "";
        }
        toast({
          title: "Document uploaded successfully",
          description: `${selectedFile.name} has been added to your documents.`,
        });
      } catch (error) {
        toast({
          title: "Upload failed",
          description: error.message || "Failed to upload document. Please try again.",
        });
      }
    }
  };

  const clearSelection = () => {
    setSelectedFile(null);
    setError(null);
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className="bg-card rounded-2xl shadow-card p-6 animate-fade-up">
      <h2 className="text-lg font-semibold text-foreground mb-4">Upload Document</h2>
      
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        className={`
          relative border-2 border-dashed rounded-xl p-8 text-center cursor-pointer
          transition-all duration-300 ease-out
          ${isDragging 
            ? "drag-active border-primary" 
            : "border-border hover:border-primary/50 hover:bg-muted/50"
          }
        `}
      >
        <input
          ref={inputRef}
          type="file"
          accept=".pdf,.png,.jpg,.jpeg,.doc,.docx"
          onChange={handleFileSelect}
          className="hidden"
        />
        
        <div className="flex flex-col items-center gap-3">
          <div className={`
            p-4 rounded-full transition-colors duration-300
            ${isDragging ? "bg-primary/10" : "bg-secondary"}
          `}>
            <Upload className={`w-8 h-8 transition-colors ${isDragging ? "text-primary" : "text-secondary-foreground"}`} />
          </div>
          <div>
            <p className="font-medium text-foreground">
              {isDragging ? "Drop your file here" : "Drag & drop your file here"}
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              or click to browse • Max 50MB
            </p>
          </div>
        </div>
      </div>

      {error && (
        <div className="mt-4 flex items-center gap-2 text-destructive bg-destructive/10 px-4 py-3 rounded-lg animate-scale-in">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span className="text-sm">{error}</span>
        </div>
      )}

      {selectedFile && !error && (
        <div className="mt-4 animate-scale-in">
          <div className="flex items-center justify-between bg-secondary/50 px-4 py-3 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <FileUp className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="font-medium text-foreground text-sm">{selectedFile.name}</p>
                <p className="text-xs text-muted-foreground">{formatFileSize(selectedFile.size)}</p>
              </div>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                clearSelection();
              }}
              className="p-1 hover:bg-muted rounded-full transition-colors"
            >
              <X className="w-4 h-4 text-muted-foreground" />
            </button>
          </div>
          
          <Button 
            onClick={(e) => {
              e.stopPropagation();
              handleUpload();
            }}
            className="w-full mt-4 healthcare-gradient hover:opacity-90 transition-opacity"
          >
            <FileUp className="w-4 h-4 mr-2" />
            Upload Document
          </Button>
        </div>
      )}
    </div>
  );
};

export default UploadZone;
