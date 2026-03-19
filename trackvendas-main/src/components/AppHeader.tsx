import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { LogOut, Store } from "lucide-react";
import { apiGetStores } from "@/lib/api-service";
import { Store as StoreType } from "@/lib/types";

const roleLabelMap = {
  vendedor: "Vendedor",
  gerente: "Gerente",
  dono: "Administrador",
};

export function AppHeader() {
  const { user, logout } = useAuth();
  const [stores, setStores] = useState<StoreType[]>([]);

  useEffect(() => {
    apiGetStores().then(setStores).catch(() => setStores([]));
  }, []);

  if (!user) return null;

  const storeName = stores.find(s => s.id === user.storeId)?.name ?? "-";

  return (
    <header className="gradient-primary px-4 py-4 text-primary-foreground">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center text-accent-foreground font-bold text-sm">
            {user.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
          </div>
          <div>
            <h2 className="font-semibold text-sm">{user.name}</h2>
            <div className="flex items-center gap-2 text-xs opacity-80">
              <span className="bg-accent/20 px-2 py-0.5 rounded-full">{roleLabelMap[user.role]}</span>
              <span className="flex items-center gap-1">
                <Store className="w-3 h-3" />
                {storeName}
              </span>
            </div>
          </div>
        </div>
        <button onClick={logout} className="p-2 rounded-md hover:bg-primary-foreground/10 transition-colors">
          <LogOut className="w-5 h-5" />
        </button>
      </div>
    </header>
  );
}
