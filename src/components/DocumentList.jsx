import { Link } from "react-router-dom";
import { FileText, Download, Trash2, Calendar, HardDrive } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const DocumentList = ({ documents, onDelete, onDownload }) => {
  const formatFileSize = (bytes) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const formatDate = (date) => {
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(new Date(date));
  };

  const getTypeColor = (type) => {
    switch (type) {
      case "prescription":
        return "bg-blue-500/20 text-blue-400";
      case "test-result":
        return "bg-primary/20 text-primary";
      case "referral":
        return "bg-purple-500/20 text-purple-400";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const getTypeLabel = (type) => {
    switch (type) {
      case "prescription":
        return "Prescription";
      case "test-result":
        return "Test Result";
      case "referral":
        return "Referral";
      default:
        return "Document";
    }
  };

  const handleDelete = async (doc, e) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      await onDelete(doc.id);
      toast({
        title: "Document deleted",
        description: `${doc.filename} has been removed.`,
      });
    } catch (error) {
      toast({
        title: "Delete failed",
        description: error.message || "Failed to delete document. Please try again.",
      });
    }
  };

  const handleDownload = async (doc, e) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      await onDownload(doc);
      toast({
        title: "Download started",
        description: `Downloading ${doc.filename}...`,
      });
    } catch (error) {
      toast({
        title: "Download failed",
        description: error.message || "Failed to download document. Please try again.",
      });
    }
  };

  if (documents.length === 0) {
    return (
      <div className="bg-card rounded-2xl shadow-card p-8 text-center animate-fade-up">
        <div className="flex flex-col items-center gap-4">
          <div className="p-4 bg-secondary rounded-full">
            <FileText className="w-10 h-10 text-secondary-foreground" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">No documents yet</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Upload your first medical document to get started
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-2xl shadow-card overflow-hidden animate-fade-up">
      <div className="divide-y divide-border">
        {documents.map((doc, index) => (
          <Link
            key={doc.id}
            to={`/documents/${doc.id}`}
            className="block p-4 hover:bg-muted/30 transition-colors animate-scale-in"
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <div className="flex items-center gap-4">
              <div className="p-3 bg-primary/10 rounded-xl shrink-0">
                <FileText className="w-6 h-6 text-primary" />
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-medium text-foreground truncate">{doc.filename}</h3>
                  <span className={`text-xs px-2 py-0.5 rounded-full shrink-0 ${getTypeColor(doc.type)}`}>
                    {getTypeLabel(doc.type)}
                  </span>
                </div>
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {formatDate(doc.createdAt)}
                  </span>
                  <span className="flex items-center gap-1">
                    <HardDrive className="w-3 h-3" />
                    {formatFileSize(doc.size)}
                  </span>
                </div>
              </div>
              
              <div className="flex items-center gap-2 shrink-0">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={(e) => handleDownload(doc, e)}
                  className="gap-1.5"
                >
                  <Download className="w-4 h-4" />
                  <span className="hidden sm:inline">Download</span>
                </Button>
                
                <AlertDialog>
                  <AlertDialogTrigger asChild onClick={(e) => e.preventDefault()}>
                    <Button
                      variant="outline"
                      size="sm"
                      className="gap-1.5 text-destructive hover:text-destructive hover:bg-destructive/10 hover:border-destructive/30"
                    >
                      <Trash2 className="w-4 h-4" />
                      <span className="hidden sm:inline">Delete</span>
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete document?</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to delete "{doc.filename}"? This action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={(e) => handleDelete(doc, e)}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                      >
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default DocumentList;
