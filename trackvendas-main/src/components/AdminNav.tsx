import { BarChart3, Settings, Store, Users, ClipboardList } from "lucide-react";

interface AdminNavProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  tabs: Array<{ id: string; label: string; icon: React.ReactNode }>;
}

export const MANAGER_TABS = [
  { id: "dashboard", label: "Dashboard", icon: <BarChart3 className="w-4 h-4" /> },
  { id: "vendors", label: "Vendedores", icon: <Users className="w-4 h-4" /> },
  { id: "stores", label: "Lojas", icon: <Store className="w-4 h-4" /> },
  { id: "reasons", label: "Motivos", icon: <ClipboardList className="w-4 h-4" /> },
];

export const OWNER_TABS = [
  { id: "dashboard", label: "Dashboard", icon: <BarChart3 className="w-4 h-4" /> },
  { id: "vendors", label: "Vendedores", icon: <Users className="w-4 h-4" /> },
  { id: "stores", label: "Lojas", icon: <Store className="w-4 h-4" /> },
  { id: "reasons", label: "Motivos", icon: <ClipboardList className="w-4 h-4" /> },
];

export function AdminNav({ activeTab, onTabChange, tabs }: AdminNavProps) {
  return (
    <div className="flex gap-1 bg-card border border-border rounded-lg p-1 overflow-x-auto">
      {tabs.map(tab => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-md text-xs font-medium transition-colors whitespace-nowrap ${
            activeTab === tab.id
              ? "bg-primary text-primary-foreground"
              : "text-muted-foreground hover:text-foreground hover:bg-muted"
          }`}
        >
          {tab.icon}
          {tab.label}
        </button>
      ))}
    </div>
  );
}
