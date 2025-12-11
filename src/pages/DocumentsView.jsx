import { useParams, useNavigate, Link } from "react-router-dom";
import Header from "@/components/Header";
import { useDocuments } from "@/hooks/useDocuments";
import { FileText, Download, Trash2, ArrowLeft, Calendar, HardDrive } from "lucide-react";
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

const DocumentView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { documents, deleteDocument, downloadDocument } = useDocuments();
  
  const document = documents.find(doc => doc.id === id);

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const formatDate = (date) => {
    return new Intl.DateTimeFormat("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(date));
  };

  const handleDelete = async () => {
    try {
      await deleteDocument(id);
      toast({
        title: "Document deleted",
        description: "The document has been removed.",
      });
      navigate("/documents");
    } catch (error) {
      toast({
        title: "Delete failed",
        description: error.message || "Failed to delete document. Please try again.",
      });
    }
  };

  const handleDownload = async () => {
    try {
      await downloadDocument(document);
      toast({
        title: "Download started",
        description: `Downloading ${document.filename}...`,
      });
    } catch (error) {
      toast({
        title: "Download failed",
        description: error.message || "Failed to download document. Please try again.",
      });
    }
  };

  if (!document) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
          <div className="bg-card rounded-2xl shadow-card p-8 text-center">
            <FileText className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-foreground mb-2">Document not found</h2>
            <p className="text-muted-foreground mb-6">The document you're looking for doesn't exist.</p>
            <Link to="/documents">
              <Button variant="outline" className="gap-2">
                <ArrowLeft className="w-4 h-4" />
                Back to Documents
              </Button>
            </Link>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        {/* Back Button */}
        <Link to="/documents" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Back to Documents
        </Link>

        {/* Document Info Card */}
        <div className="bg-card rounded-2xl shadow-card overflow-hidden mb-6 animate-fade-up">
          <div className="p-6 border-b border-border">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="p-4 bg-primary/10 rounded-xl">
                  <FileText className="w-8 h-8 text-primary" />
                </div>
                <div>
                  <h1 className="text-xl font-semibold text-foreground mb-1">{document.filename}</h1>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {formatDate(document.createdAt)}
                    </span>
                    <span className="flex items-center gap-1">
                      <HardDrive className="w-4 h-4" />
                      {formatFileSize(document.size)}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <Button onClick={handleDownload} className="healthcare-gradient gap-2">
                  <Download className="w-4 h-4" />
                  Download
                </Button>
                
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="outline" className="gap-2 text-destructive hover:text-destructive hover:bg-destructive/10 hover:border-destructive/30">
                      <Trash2 className="w-4 h-4" />
                      Delete
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete document?</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to delete "{document.filename}"? This action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={handleDelete}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                      >
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          </div>
        </div>

        {/* PDF Viewer */}
        <div className="bg-card rounded-2xl shadow-card overflow-hidden animate-fade-up">
          <div className="p-4 bg-muted/30">
            {document.data ? (
              <iframe
                src={document.data}
                className="w-full h-[70vh] rounded-lg border border-border bg-white"
                title={document.filename}
              />
            ) : (
              <div className="flex flex-col items-center justify-center h-[50vh] text-muted-foreground">
                <FileText className="w-16 h-16 mb-4" />
                <p>Preview not available</p>
                <Button
                  variant="outline"
                  onClick={handleDownload}
                  className="mt-4 gap-2"
                >
                  <Download className="w-4 h-4" />
                  Download to view
                </Button>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default DocumentView;
