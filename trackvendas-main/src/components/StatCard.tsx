import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  variant?: "default" | "accent" | "success" | "destructive";
  subtitle?: string;
}

const variantStyles = {
  default: "bg-card border border-border",
  accent: "gradient-accent text-accent-foreground",
  success: "bg-success text-success-foreground",
  destructive: "bg-destructive text-destructive-foreground",
};

const iconVariantStyles = {
  default: "bg-secondary text-muted-foreground",
  accent: "bg-accent-foreground/20 text-accent-foreground",
  success: "bg-success-foreground/20 text-success-foreground",
  destructive: "bg-destructive-foreground/20 text-destructive-foreground",
};

export function StatCard({ title, value, icon: Icon, variant = "default", subtitle }: StatCardProps) {
  return (
    <div className={cn("rounded-lg p-4 shadow-card animate-fade-in", variantStyles[variant])}>
      <div className="flex items-center justify-between mb-2">
        <span className={cn("text-xs font-medium uppercase tracking-wide", variant === "default" ? "text-muted-foreground" : "opacity-80")}>
          {title}
        </span>
        <div className={cn("w-8 h-8 rounded-md flex items-center justify-center", iconVariantStyles[variant])}>
          <Icon className="w-4 h-4" />
        </div>
      </div>
      <div className="text-2xl font-bold">{value}</div>
      {subtitle && <p className={cn("text-xs mt-1", variant === "default" ? "text-muted-foreground" : "opacity-70")}>{subtitle}</p>}
    </div>
  );
}
