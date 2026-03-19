import { useEffect, useMemo, useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { AppHeader } from "@/components/AppHeader";
import { StatCard } from "@/components/StatCard";
import { AdminNav, MANAGER_TABS } from "@/components/AdminNav";
import { VendorManagement } from "@/components/admin/VendorManagement";
import { StoreManagement } from "@/components/admin/StoreManagement";
import { ReasonManagement } from "@/components/admin/ReasonManagement";
import {
  ShoppingCart,
  DollarSign,
  TrendingDown,
  Users,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { apiGetLossesForStore, apiGetSalesForStore, apiGetUsersByStore } from "@/lib/api-service";
import { LossRecord, SaleRecord, User } from "@/lib/types";
import { formatCurrency } from "@/lib/format";
import { toast } from "sonner";

const CHART_COLORS = [
  "hsl(32, 95%, 52%)",
  "hsl(220, 60%, 30%)",
  "hsl(152, 60%, 42%)",
  "hsl(0, 72%, 51%)",
  "hsl(38, 92%, 50%)",
  "hsl(270, 50%, 50%)",
];

export default function ManagerPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [expandedVendor, setExpandedVendor] = useState<string | null>(null);
  const [sales, setSales] = useState<SaleRecord[]>([]);
  const [losses, setLosses] = useState<LossRecord[]>([]);
  const [vendors, setVendors] = useState<User[]>([]);

  useEffect(() => {
    if (!user) return;
    Promise.all([
      apiGetSalesForStore(user.storeId),
      apiGetLossesForStore(user.storeId),
      apiGetUsersByStore(user.storeId),
    ])
      .then(([s, l, u]) => {
        setSales(s);
        setLosses(l);
        setVendors(u.filter(x => x.role === "vendedor"));
      })
      .catch(() => toast.error("Falha ao carregar dados da loja."));
  }, [user]);

  const dashboardData = useMemo(() => {
    const totalSales = sales.length;
    const totalValue = sales.reduce((sum, s) => sum + s.amount, 0);
    const totalLosses = losses.length;

    const vendorData = vendors.map(v => {
      const vSales = sales.filter(s => s.vendorId === v.id);
      const vLosses = losses.filter(l => l.vendorId === v.id);
      const reasonBreakdown: Record<string, number> = {};
      vLosses.forEach(l => {
        reasonBreakdown[l.reasonLabel] = (reasonBreakdown[l.reasonLabel] || 0) + 1;
      });
      return {
        id: v.id,
        name: v.name.split(" ")[0],
        fullName: v.name,
        vendas: vSales.length,
        valor: vSales.reduce((sum, s) => sum + s.amount, 0),
        perdas: vLosses.length,
        reasonBreakdown,
      };
    });

    const reasonCounts: Record<string, number> = {};
    losses.forEach(l => {
      reasonCounts[l.reasonLabel] = (reasonCounts[l.reasonLabel] || 0) + 1;
    });
    const pieData = Object.entries(reasonCounts).map(([name, value]) => ({ name, value }));
    const allReasons = Array.from(new Set(losses.map(l => l.reasonLabel)));

    const comparisonData = vendorData.map(v => {
      const row: Record<string, string | number> = { name: v.name };
      allReasons.forEach(reason => {
        const count = v.reasonBreakdown[reason] || 0;
        row[`${reason}_count`] = count;
        row[`${reason}_pct`] = v.perdas > 0 ? Math.round((count / v.perdas) * 100) : 0;
      });
      row.totalPerdas = v.perdas;
      return row;
    });

    return { totalSales, totalValue, totalLosses, vendorData, pieData, allReasons, comparisonData };
  }, [sales, losses, vendors]);

  if (!user) return null;

  const storeId = user.storeId;

  const renderDashboard = () => {
    const { totalSales, totalValue, totalLosses, vendorData, pieData, allReasons, comparisonData } = dashboardData;

    return (
      <>
        <div className="grid grid-cols-2 gap-3">
          <StatCard title="Vendas" value={totalSales} icon={ShoppingCart} />
          <StatCard title="Faturado" value={formatCurrency(totalValue)} icon={DollarSign} variant="accent" />
          <StatCard title="Perdas" value={totalLosses} icon={TrendingDown} variant="destructive" />
          <StatCard title="Vendedores" value={vendors.length} icon={Users} />
        </div>

        <div className="bg-card rounded-lg border border-border p-4 shadow-card animate-slide-up">
          <h3 className="font-semibold text-foreground mb-1">Vendas x Perdas por Vendedor</h3>
          <p className="text-xs text-muted-foreground mb-4">Desempenho comparativo da equipe</p>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={vendorData} barGap={2}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 15%, 90%)" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Bar dataKey="vendas" fill="hsl(152, 60%, 42%)" radius={[4, 4, 0, 0]} name="Vendas" />
              <Bar dataKey="perdas" fill="hsl(0, 72%, 51%)" radius={[4, 4, 0, 0]} name="Perdas" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-card rounded-lg border border-border p-4 shadow-card animate-slide-up">
          <h3 className="font-semibold text-foreground mb-1">Motivos de Perda</h3>
          <p className="text-xs text-muted-foreground mb-4">Distribui????o por motivo na loja</p>
          <div className="flex items-center gap-4">
            <ResponsiveContainer width="50%" height={180}>
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" outerRadius={70} dataKey="value" label={false}>
                  {pieData.map((_, i) => (
                    <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-2 flex-1">
              {pieData.map((item, i) => (
                <div key={item.name} className="flex items-center gap-2 text-xs">
                  <div className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: CHART_COLORS[i % CHART_COLORS.length] }} />
                  <span className="text-foreground">{item.name}</span>
                  <span className="ml-auto font-semibold text-foreground">{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-card rounded-lg border border-border p-4 shadow-card animate-slide-up">
          <h3 className="font-semibold text-foreground mb-3">Ranking de Vendedores</h3>
          <p className="text-xs text-muted-foreground mb-3">Clique em um vendedor para ver os motivos de perda</p>
          <div className="space-y-2">
            {vendorData.sort((a, b) => b.valor - a.valor).map((v, i) => (
              <div key={v.id}>
                <button
                  onClick={() => setExpandedVendor(expandedVendor === v.id ? null : v.id)}
                  className="w-full flex items-center gap-3 p-3 bg-background rounded-md border border-border hover:border-primary/40 transition-colors text-left"
                >
                  <span className="w-6 h-6 rounded-full gradient-accent text-accent-foreground text-xs font-bold flex items-center justify-center shrink-0">
                    {i + 1}
                  </span>
                  <div className="flex-1 min-w-0">
                    <span className="text-sm font-medium text-foreground">{v.fullName}</span>
                    <div className="flex gap-3 text-xs text-muted-foreground">
                      <span>{v.vendas} vendas</span>
                      <span>{v.perdas} perdas</span>
                    </div>
                  </div>
                  <span className="text-sm font-bold text-foreground mr-2">{formatCurrency(v.valor)}</span>
                  {expandedVendor === v.id ? (
                    <ChevronUp className="w-4 h-4 text-muted-foreground shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-muted-foreground shrink-0" />
                  )}
                </button>
                {expandedVendor === v.id && (
                  <div className="mt-1 ml-9 mr-1 p-3 bg-muted/50 rounded-md border border-border animate-slide-up">
                    <h4 className="text-xs font-semibold text-foreground mb-2">Motivos de Perda ??? {v.fullName}</h4>
                    {v.perdas === 0 ? (
                      <p className="text-xs text-muted-foreground">Nenhuma perda registrada</p>
                    ) : (
                      <div className="space-y-1.5">
                        {Object.entries(v.reasonBreakdown)
                          .sort((a, b) => b[1] - a[1])
                          .map(([reason, count]) => (
                            <div key={reason} className="flex items-center justify-between text-xs">
                              <span className="text-foreground">{reason}</span>
                              <div className="flex items-center gap-2">
                                <div className="w-16 h-1.5 bg-border rounded-full overflow-hidden">
                                  <div className="h-full rounded-full bg-primary" style={{ width: `${(count / v.perdas) * 100}%` }} />
                                </div>
                                <span className="font-semibold text-foreground w-6 text-right">{count}</span>
                                <span className="text-muted-foreground w-10 text-right">{Math.round((count / v.perdas) * 100)}%</span>
                              </div>
                            </div>
                          ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="bg-card rounded-lg border border-border p-4 shadow-card animate-slide-up">
          <h3 className="font-semibold text-foreground mb-1">Comparativo de Motivos por Vendedor</h3>
          <p className="text-xs text-muted-foreground mb-4">Percentual de cada motivo de perda ??? identifique onde treinar</p>
          <div className="overflow-x-auto -mx-4 px-4">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-2 pr-3 font-semibold text-foreground whitespace-nowrap">Vendedor</th>
                  {allReasons.map(reason => (
                    <th key={reason} className="text-center py-2 px-2 font-semibold text-foreground whitespace-nowrap">{reason}</th>
                  ))}
                  <th className="text-center py-2 pl-3 font-semibold text-foreground whitespace-nowrap">Total</th>
                </tr>
              </thead>
              <tbody>
                {comparisonData.map((row, i) => (
                  <tr key={i} className="border-b border-border/50 last:border-0">
                    <td className="py-2.5 pr-3 font-medium text-foreground whitespace-nowrap">{row.name}</td>
                    {allReasons.map(reason => {
                      const pct = row[`${reason}_pct`] as number;
                      const count = row[`${reason}_count`] as number;
                      return (
                        <td key={reason} className="text-center py-2.5 px-2">
                          <div className="flex flex-col items-center">
                            <span className={`font-bold ${pct >= 50 ? 'text-destructive' : 'text-foreground'}`}>{pct}%</span>
                            <span className="text-muted-foreground">{count}</span>
                          </div>
                        </td>
                      );
                    })}
                    <td className="text-center py-2.5 pl-3 font-bold text-foreground">{row.totalPerdas}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </>
    );
  };

  return (
    <div className="min-h-screen bg-background pb-8">
      <AppHeader />
      <div className="px-4 py-4">
        <AdminNav activeTab={activeTab} onTabChange={setActiveTab} tabs={MANAGER_TABS} />
      </div>
      <div className="px-4 space-y-5">
        {activeTab === "dashboard" && renderDashboard()}
        {activeTab === "vendors" && <VendorManagement filterStoreId={storeId} />}
        {activeTab === "stores" && <StoreManagement filterStoreId={storeId} />}
        {activeTab === "reasons" && <ReasonManagement />}
      </div>
    </div>
  );
}
