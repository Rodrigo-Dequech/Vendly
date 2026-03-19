import { useEffect, useMemo, useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { AppHeader } from "@/components/AppHeader";
import { StatCard } from "@/components/StatCard";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import {
  ShoppingCart,
  DollarSign,
  TrendingDown,
  Check,
} from "lucide-react";
import { toast } from "sonner";
import { apiCreateLoss, apiGetLossReasons, apiGetLossesForVendor, apiGetSalesForVendor } from "@/lib/api-service";
import { LossReason, LossRecord, SaleRecord } from "@/lib/types";
import { formatCurrency } from "@/lib/format";

export default function VendorPage() {
  const { user } = useAuth();
  const [selectedReasons, setSelectedReasons] = useState<string[]>([]);
  const [otherNote, setOtherNote] = useState("");
  const [saved, setSaved] = useState(false);
  const [reasons, setReasons] = useState<LossReason[]>([]);
  const [sales, setSales] = useState<SaleRecord[]>([]);
  const [losses, setLosses] = useState<LossRecord[]>([]);

  useEffect(() => {
    if (!user) return;
    Promise.all([
      apiGetLossReasons(),
      apiGetSalesForVendor(user.id),
      apiGetLossesForVendor(user.id),
    ])
      .then(([r, s, l]) => {
        setReasons(r);
        setSales(s);
        setLosses(l);
      })
      .catch(() => {
        toast.error("Falha ao carregar dados.");
      });
  }, [user]);

  const reasonMap = useMemo(() => {
    const map: Record<string, LossReason> = {};
    reasons.forEach(r => { map[r.id] = r; });
    return map;
  }, [reasons]);

  if (!user) return null;

  const totalSales = sales.length;
  const totalValue = sales.reduce((sum, s) => sum + s.amount, 0);
  const totalLosses = losses.length;

  const toggleReason = (id: string) => {
    setSelectedReasons(prev =>
      prev.includes(id) ? prev.filter(r => r !== id) : [...prev, id]
    );
    setSaved(false);
  };

  const handleSave = async () => {
    if (selectedReasons.length === 0) {
      toast.error("Selecione pelo menos um motivo de perda.");
      return;
    }
    const otherReason = reasons.find(r => r.requiresNote);
    if (otherReason && selectedReasons.includes(otherReason.id) && !otherNote.trim()) {
      toast.error("Preencha o motivo em 'Outros'.");
      return;
    }

    try {
      await Promise.all(selectedReasons.map(reasonId => {
        const reason = reasonMap[reasonId];
        return apiCreateLoss({
          vendorId: user.id,
          storeId: user.storeId,
          reasonId: reasonId,
          reasonLabel: reason?.label || "",
          note: reason?.requiresNote ? otherNote.trim() : undefined,
        });
      }));

      toast.success("Perda registrada com sucesso!");
      setSaved(true);
      setTimeout(() => {
        setSelectedReasons([]);
        setOtherNote("");
        setSaved(false);
      }, 2000);

      const updated = await apiGetLossesForVendor(user.id);
      setLosses(updated);
    } catch {
      toast.error("Falha ao registrar perda.");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <AppHeader />

      <div className="px-4 py-5 space-y-5">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-3">
          <StatCard title="Vendas" value={totalSales} icon={ShoppingCart} />
          <StatCard title="Faturado" value={formatCurrency(totalValue)} icon={DollarSign} variant="success" />
          <StatCard title="Perdas" value={totalLosses} icon={TrendingDown} variant="destructive" />
        </div>

        {/* Loss Registration */}
        <div className="bg-card rounded-lg border border-border p-4 shadow-card animate-slide-up">
          <h3 className="font-semibold text-foreground mb-1">Registrar Perda de Venda</h3>
          <p className="text-xs text-muted-foreground mb-4">Selecione o(s) motivo(s) da perda</p>

          <div className="space-y-3">
            {reasons.map(reason => (
              <label
                key={reason.id}
                className="flex items-center gap-3 p-3 rounded-md border border-border bg-background hover:bg-secondary/50 transition-colors cursor-pointer"
              >
                <Checkbox
                  checked={selectedReasons.includes(reason.id)}
                  onCheckedChange={() => toggleReason(reason.id)}
                />
                <span className="text-sm font-medium text-foreground">{reason.label}</span>
              </label>
            ))}

            {reasons.some(r => r.requiresNote) && selectedReasons.includes(reasons.find(r => r.requiresNote)?.id || "") && (
              <Textarea
                placeholder="Descreva o motivo..."
                value={otherNote}
                onChange={e => setOtherNote(e.target.value)}
                className="mt-2 animate-fade-in"
              />
            )}
          </div>

          <Button
            onClick={handleSave}
            disabled={saved}
            className="w-full mt-4 h-12 gradient-accent text-accent-foreground font-semibold"
          >
            {saved ? (
              <span className="flex items-center gap-2"><Check className="w-4 h-4" /> Salvo!</span>
            ) : (
              "Salvar Perda"
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
