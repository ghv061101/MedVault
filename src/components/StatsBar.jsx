import { FileText, HardDrive, Clock } from "lucide-react";

const StatsBar = ({ documents }) => {
  const totalSize = documents.reduce((acc, doc) => acc + doc.size, 0);
  
  const formatFileSize = (bytes) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const getLatestUpload = () => {
    if (documents.length === 0) return "No uploads";
    const latest = documents.reduce((a, b) => {
      const aDate = new Date(a.createdAt);
      const bDate = new Date(b.createdAt);
      return aDate > bDate ? a : b;
    });
    const now = new Date();
    const latestDate = new Date(latest.createdAt);
    const diff = now.getTime() - latestDate.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    
    if (minutes < 1) return "Just now";
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  const stats = [
    {
      icon: FileText,
      label: "Total Documents",
      value: documents.length.toString(),
    },
    {
      icon: HardDrive,
      label: "Storage Used",
      value: formatFileSize(totalSize),
    },
    {
      icon: Clock,
      label: "Latest Upload",
      value: getLatestUpload(),
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 animate-fade-up">
      {stats.map((stat, index) => (
        <div
          key={stat.label}
          className="bg-card rounded-xl shadow-card p-4 flex items-center gap-4"
          style={{ animationDelay: `${index * 100}ms` }}
        >
          <div className="p-3 bg-secondary rounded-xl">
            <stat.icon className="w-5 h-5 text-secondary-foreground" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">{stat.label}</p>
            <p className="text-xl font-semibold text-foreground">{stat.value}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default StatsBar;
