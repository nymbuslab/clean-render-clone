import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { mockStats, mockRevenueChart, mockTopProducts } from "@/data/mockData";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function ReportsPage() {
  const fmt = (v: number) => v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
  const maxVal = Math.max(...mockRevenueChart.map(d => d.value));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Relatórios</h1>
          <p className="text-muted-foreground text-sm">Acompanhe o desempenho da sua loja</p>
        </div>
        <Select defaultValue="30d">
          <SelectTrigger className="w-40 h-9">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7d">Últimos 7 dias</SelectItem>
            <SelectItem value="30d">Últimos 30 dias</SelectItem>
            <SelectItem value="90d">Últimos 90 dias</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Faturamento Total", value: fmt(mockStats.revenue) },
          { label: "Total de Pedidos", value: String(mockStats.orders) },
          { label: "Ticket Médio", value: fmt(mockStats.avgTicket) },
          { label: "Novos Clientes", value: String(mockStats.customers) },
        ].map(s => (
          <Card key={s.label} className="shadow-card">
            <CardContent className="p-5">
              <p className="text-sm text-muted-foreground">{s.label}</p>
              <p className="text-2xl font-bold mt-1">{s.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="shadow-card">
          <CardHeader><CardTitle className="text-base">Faturamento por Período</CardTitle></CardHeader>
          <CardContent>
            <div className="flex items-end gap-3 h-52">
              {mockRevenueChart.map((d) => (
                <div key={d.month} className="flex-1 flex flex-col items-center gap-1">
                  <span className="text-xs text-muted-foreground">{fmt(d.value)}</span>
                  <div className="w-full rounded-t-md gradient-primary" style={{ height: `${(d.value / maxVal) * 170}px` }} />
                  <span className="text-xs text-muted-foreground">{d.month}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardHeader><CardTitle className="text-base">Produtos Mais Vendidos</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockTopProducts.map((p, i) => (
                <div key={p.name}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium">{p.name}</span>
                    <span className="text-sm text-muted-foreground">{p.sold} un.</span>
                  </div>
                  <div className="h-2 rounded-full bg-muted overflow-hidden">
                    <div className="h-full rounded-full gradient-primary" style={{ width: `${(p.sold / mockTopProducts[0].sold) * 100}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
