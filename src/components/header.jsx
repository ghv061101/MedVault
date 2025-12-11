import { Link, useLocation } from "react-router-dom";
import { FileText, Heart, Home } from "lucide-react";

const Header = () => {
  const location = useLocation();
  
  return (
    <header className="bg-card border-b border-border py-4 px-6">
      <div className="max-w-5xl mx-auto flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
          <div className="p-2 bg-primary/20 rounded-xl">
            <Heart className="w-7 h-7 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-foreground">MedVault</h1>
            <p className="text-sm text-muted-foreground">Patient Document Portal</p>
          </div>
        </Link>
        
        <nav className="flex items-center gap-4">
          <Link 
            to="/" 
            className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
              location.pathname === "/" 
                ? "bg-primary/10 text-primary" 
                : "text-muted-foreground hover:text-foreground hover:bg-muted"
            }`}
          >
            <Home className="w-4 h-4" />
            <span className="hidden sm:inline">Home</span>
          </Link>
          <Link 
            to="/documents" 
            className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
              location.pathname === "/documents" 
                ? "bg-primary/10 text-primary" 
                : "text-muted-foreground hover:text-foreground hover:bg-muted"
            }`}
          >
            <FileText className="w-4 h-4" />
            <span className="hidden sm:inline">Documents</span>
          </Link>
        </nav>
      </div>
    </header>
  );
};

export default Header;
