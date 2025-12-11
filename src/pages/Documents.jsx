import { useState } from "react";
import Header from "@/components/Header";
import UploadZone from "@/components/UploadZone";
import DocumentList from "@/components/DocumentList";
import StatsBar from "@/components/StatsBar";
import { useDocuments } from "@/hooks/useDocuments";
import { Search, X } from "lucide-react";

const Documents = () => {
  const { documents, isLoading, uploadDocument, deleteDocument, downloadDocument } = useDocuments();
  const [searchQuery, setSearchQuery] = useState("");

  const filteredDocuments = documents.filter(doc =>
    doc.filename.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-foreground mb-2">
            Your Documents
          </h2>
          <p className="text-muted-foreground">
            Upload, view, and manage your medical documents.
          </p>
        </div>

        <div className="space-y-6">
          <StatsBar documents={documents} />
          
          <div className="grid lg:grid-cols-5 gap-6">
            <div className="lg:col-span-2">
              <UploadZone onUpload={uploadDocument} />
            </div>
            <div className="lg:col-span-3 space-y-4">
              {/* Search Bar */}
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search documents..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-10 py-3 bg-card border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:bg-muted rounded-full transition-colors"
                  >
                    <X className="w-4 h-4 text-muted-foreground" />
                  </button>
                )}
              </div>

              {/* Documents List */}
              {isLoading ? (
                <div className="flex items-center justify-center h-48 text-muted-foreground">
                  Loading documents...
                </div>
              ) : (
                <>
                  {searchQuery && (
                    <p className="text-sm text-muted-foreground">
                      {filteredDocuments.length} {filteredDocuments.length === 1 ? "result" : "results"} for "{searchQuery}"
                    </p>
                  )}
                  <DocumentList
                    documents={filteredDocuments}
                    onDelete={deleteDocument}
                    onDownload={downloadDocument}
                  />
                </>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Documents;
