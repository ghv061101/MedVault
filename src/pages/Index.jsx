import { Link } from "react-router-dom";
import Header from "@/components/Header";
import { FileText, Upload, Shield, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";

const Index = () => {
  const features = [
    {
      icon: Upload,
      title: "Easy Upload",
      description: "Drag and drop your medical documents securely",
    },
    {
      icon: Shield,
      title: "Secure Storage",
      description: "Your documents are encrypted and protected",
    },
    {
      icon: Clock,
      title: "Quick Access",
      description: "Access your documents anytime, anywhere",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16 animate-fade-up">
          <h1 className="text-4xl sm:text-5xl font-bold text-foreground mb-4">
            Your Medical Documents,{" "}
            <span className="text-primary">Securely Managed</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
            MedVault helps you store, organize, and access your healthcare documents 
            in one secure place.
          </p>
          <Link to="/documents">
            <Button size="lg" className="healthcare-gradient text-primary-foreground hover:opacity-90 gap-2">
              <FileText className="w-5 h-5" />
              View Documents
            </Button>
          </Link>
        </div>

        {/* Features Grid */}
        <div className="grid sm:grid-cols-3 gap-6 mb-16">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className="bg-card rounded-2xl shadow-card p-6 text-center animate-fade-up glow"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="inline-flex p-4 bg-primary/10 rounded-xl mb-4">
                <feature.icon className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                {feature.title}
              </h3>
              <p className="text-muted-foreground text-sm">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="bg-card rounded-2xl shadow-card p-8 text-center animate-fade-up glow">
          <h2 className="text-2xl font-semibold text-foreground mb-4">
            Ready to get started?
          </h2>
          <p className="text-muted-foreground mb-6">
            Upload your first document and experience secure document management.
          </p>
          <Link to="/documents">
            <Button variant="outline" size="lg" className="border-primary text-primary hover:bg-primary/10 gap-2">
              <Upload className="w-5 h-5" />
              Upload Documents
            </Button>
          </Link>
        </div>
      </main>

      <footer className="border-t border-border mt-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6">
          <p className="text-sm text-muted-foreground text-center">
            © 2025 MedVault. Your health documents, securely managed.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
