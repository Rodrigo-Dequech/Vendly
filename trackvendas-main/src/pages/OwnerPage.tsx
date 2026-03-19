import { useEffect, useMemo, useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { AppHeader } from "@/components/AppHeader";
import { StatCard } from "@/components/StatCard";
import { AdminNav, OWNER_TABS } from "@/components/AdminNav";
import { VendorManagement } from "@/components/admin/VendorManagement";
import { StoreManagement } from "@/components/admin/StoreManagement";
import { ReasonManagement } from "@/components/admin/ReasonManagement";
import {
  ShoppingCart,
  DollarSign,
  TrendingDown,
  Store,
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
  LineChart,
  Line,
} from "recharts";
import { apiGetLosses, apiGetSales, apiGetStores } from "@/lib/api-service";
import { LossRecord, SaleRecord, Store as StoreType } from "@/lib/types";
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

function formatDateLabel(isoDate: string) {
  const [y, m, d] = isoDate.split("-");
  return `${d}/${m}`;
}

export default function OwnerPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [expandedStore, setExpandedStore] = useState<string | null>(null);
  const [stores, setStores] = useState<StoreType[]>([]);
  const [sales, setSales] = useState<SaleRecord[]>([]);
  const [losses, setLosses] = useState<LossRecord[]>([]);

  useEffect(() => {
    Promise.all([
      apiGetStores(),
      apiGetSales(),
      apiGetLosses(),
    ])
      .then(([st, s, l]) => {
        setStores(st);
        setSales(s);
        setLosses(l);
      })
      .catch(() => toast.error("Falha ao carregar dados da rede."));
  }, []);

  const dashboardData = useMemo(() => {
    const totalSales = sales.length;
    const totalValue = sales.reduce((sum, s) => sum + s.amount, 0);
    const totalLosses = losses.length;
    const totalStores = stores.length;

    const storeData = stores.map(store => {
      const sSales = sales.filter(s => s.storeId === store.id);
      const sLosses = losses.filter(l => l.storeId === store.id);
      const reasonBreakdown: Record<string, number> = {};
      sLosses.forEach(l => {
        reasonBreakdown[l.reasonLabel] = (reasonBreakdown[l.reasonLabel] || 0) + 1;
      });
      return {
        id: store.id,
        name: store.name.replace("Loja ", ""),
        fullName: store.name,
        vendas: sSales.length,
        valor: sSales.reduce((sum, s) => sum + s.amount, 0),
        perdas: sLosses.length,
        reasonBreakdown,
      };
    });

    const reasonCounts: Record<string, number> = {};
    losses.forEach(l => {
      reasonCounts[l.reasonLabel] = (reasonCounts[l.reasonLabel] || 0) + 1;
    });
    const pieData = Object.entries(reasonCounts)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);

    const uniqueDates = Array.from(new Set([...
      sales.map(s => s.date),
      losses.map(l => l.createdAt.slice(0, 10)),
    ])).sort().slice(-4);

    const trendData = uniqueDates.map(dateKey => ({
      date: formatDateLabel(dateKey),
      vendas: sales.filter(s => s.date === dateKey).length,
      perdas: losses.filter(l => l.createdAt.startsWith(dateKey)).length,
    }));

    const allReasons = Array.from(new Set(losses.map(l => l.reasonLabel)));

    const comparisonData = storeData.map(s => {
      const row: Record<string, string | number> = { name: s.fullName };
      allReasons.forEach(reason => {
        const count = s.reasonBreakdown[reason] || 0;
        row[`${reason}_count`] = count;
        row[`${reason}_pct`] = s.perdas > 0 ? Math.round((count / s.perdas) * 100) : 0;
      });
      row.totalPerdas = s.perdas;
      return row;
    });

    return { totalSales, totalValue, totalLosses, totalStores, storeData, pieData, trendData, allReasons, comparisonData };
  }, [stores, sales, losses]);

  if (!user) return null;

  const renderDashboard = () => {
    const { totalSales, totalValue, totalLosses, totalStores, storeData, pieData, trendData, allReasons, comparisonData } = dashboardData;

    return (
      <>
        <div className="grid grid-cols-2 gap-3">
          <StatCard title="Vendas Rede" value={totalSales} icon={ShoppingCart} />
          <StatCard title="Faturamento" value={formatCurrency(totalValue)} icon={DollarSign} variant="accent" />
          <StatCard title="Perdas Rede" value={totalLosses} icon={TrendingDown} variant="destructive" />
          <StatCard title="Lojas" value={totalStores} icon={Store} variant="success" />
        </div>

        <div className="bg-card rounded-lg border border-border p-4 shadow-card animate-slide-up">
          <h3 className="font-semibold text-foreground mb-1">Tend??ncia Vendas x Perdas</h3>
          <p className="text-xs text-muted-foreground mb-4">??ltimos dias da rede</p>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 15%, 90%)" />
              <XAxis dataKey="date" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Line type="monotone" dataKey="vendas" stroke="hsl(152, 60%, 42%)" strokeWidth={2} dot={{ r: 4 }} name="Vendas" />
              <Line type="monotone" dataKey="perdas" stroke="hsl(0, 72%, 51%)" strokeWidth={2} dot={{ r: 4 }} name="Perdas" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-card rounded-lg border border-border p-4 shadow-card animate-slide-up">
          <h3 className="font-semibold text-foreground mb-1">Comparativo entre Lojas</h3>
          <p className="text-xs text-muted-foreground mb-4">Vendas e perdas por loja</p>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={storeData} barGap={2}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 15%, 90%)" />
              <XAxis dataKey="name" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Bar dataKey="vendas" fill="hsl(152, 60%, 42%)" radius={[4, 4, 0, 0]} name="Vendas" />
              <Bar dataKey="perdas" fill="hsl(0, 72%, 51%)" radius={[4, 4, 0, 0]} name="Perdas" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-card rounded-lg border border-border p-4 shadow-card animate-slide-up">
          <h3 className="font-semibold text-foreground mb-1">Motivos de Perda ??? Rede</h3>
          <p className="text-xs text-muted-foreground mb-4">Frequ??ncia geral</p>
          <div className="flex items-center gap-4">
            <ResponsiveContainer width="45%" height={180}>
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
          <h3 className="font-semibold text-foreground mb-3">Ranking de Lojas</h3>
          <p className="text-xs text-muted-foreground mb-3">Clique em uma loja para ver os motivos de perda</p>
          <div className="space-y-2">
            {storeData.sort((a, b) => b.valor - a.valor).map((s, i) => (
              <div key={s.id}>
                <button
                  onClick={() => setExpandedStore(expandedStore === s.id ? null : s.id)}
                  className="w-full flex items-center gap-3 p-3 bg-background rounded-md border border-border hover:border-primary/40 transition-colors text-left"
                >
                  <span className="w-6 h-6 rounded-full gradient-accent text-accent-foreground text-xs font-bold flex items-center justify-center shrink-0">
                    {i + 1}
                  </span>
                  <div className="flex-1 min-w-0">
                    <span className="text-sm font-medium text-foreground">{s.fullName}</span>
                    <div className="flex gap-3 text-xs text-muted-foreground">
                      <span>{s.vendas} vendas</span>
                      <span>{s.perdas} perdas</span>
                    </div>
                  </div>
                  <span className="text-sm font-bold text-foreground mr-2">{formatCurrency(s.valor)}</span>
                  {expandedStore === s.id ? (
                    <ChevronUp className="w-4 h-4 text-muted-foreground shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-muted-foreground shrink-0" />
                  )}
                </button>
                {expandedStore === s.id && (
                  <div className="mt-1 ml-9 mr-1 p-3 bg-muted/50 rounded-md border border-border animate-slide-up">
                    <h4 className="text-xs font-semibold text-foreground mb-2">Motivos de Perda ??? {s.fullName}</h4>
                    {s.perdas === 0 ? (
                      <p className="text-xs text-muted-foreground">Nenhuma perda registrada</p>
                    ) : (
                      <div className="space-y-1.5">
                        {Object.entries(s.reasonBreakdown)
                          .sort((a, b) => b[1] - a[1])
                          .map(([reason, count]) => (
                            <div key={reason} className="flex items-center justify-between text-xs">
                              <span className="text-foreground">{reason}</span>
                              <div className="flex items-center gap-2">
                                <div className="w-16 h-1.5 bg-border rounded-full overflow-hidden">
                                  <div className="h-full rounded-full bg-primary" style={{ width: `${(count / s.perdas) * 100}%` }} />
                                </div>
                                <span className="font-semibold text-foreground w-6 text-right">{count}</span>
                                <span className="text-muted-foreground w-10 text-right">{Math.round((count / s.perdas) * 100)}%</span>
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
          <h3 className="font-semibold text-foreground mb-1">Comparativo de Motivos por Loja</h3>
          <p className="text-xs text-muted-foreground mb-4">Percentual de cada motivo de perda ??? identifique padr??es por loja</p>
          <div className="overflow-x-auto -mx-4 px-4">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-2 pr-3 font-semibold text-foreground whitespace-nowrap">Loja</th>
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
        <AdminNav activeTab={activeTab} onTabChange={setActiveTab} tabs={OWNER_TABS} />
      </div>
      <div className="px-4 space-y-5">
        {activeTab === "dashboard" && renderDashboard()}
        {activeTab === "vendors" && <VendorManagement canManageManagers />}
        {activeTab === "stores" && <StoreManagement />}
        {activeTab === "reasons" && <ReasonManagement />}
      </div>
    </div>
  );
}
