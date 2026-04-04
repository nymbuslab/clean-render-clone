import { TrendingUp, TrendingDown, DollarSign, ShoppingCart, Users, BarChart3 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { mockStats, mockRevenueChart, mockTopProducts, mockOrders, orderStatusLabels, orderStatusColors } from "@/data/mockData";
import { Badge } from "@/components/ui/badge";

function StatCard({ title, value, growth, icon: Icon }: { title: string; value: string; growth: number; icon: React.ElementType }) {
  const positive = growth >= 0;
  return (
    <Card className="shadow-card">
      <CardContent className="p-5">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">{title}</p>
            <p className="text-2xl font-bold mt-1">{value}</p>
            <div className={`flex items-center gap-1 mt-1 text-xs font-medium ${positive ? "text-success" : "text-destructive"}`}>
              {positive ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
              {positive ? "+" : ""}{growth}% vs mês anterior
            </div>
          </div>
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10">
            <Icon className="h-5 w-5 text-primary" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function DashboardPage() {
  const fmt = (v: number) => v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
  const maxVal = Math.max(...mockRevenueChart.map(d => d.value));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground text-sm">Visão geral da sua loja</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Faturamento" value={fmt(mockStats.revenue)} growth={mockStats.revenueGrowth} icon={DollarSign} />
        <StatCard title="Pedidos" value={String(mockStats.orders)} growth={mockStats.ordersGrowth} icon={ShoppingCart} />
        <StatCard title="Ticket Médio" value={fmt(mockStats.avgTicket)} growth={mockStats.ticketGrowth} icon={BarChart3} />
        <StatCard title="Clientes" value={String(mockStats.customers)} growth={mockStats.customersGrowth} icon={Users} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue chart */}
        <Card className="lg:col-span-2 shadow-card">
          <CardHeader>
            <CardTitle className="text-base">Faturamento Mensal</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-end gap-3 h-48">
              {mockRevenueChart.map((d) => (
                <div key={d.month} className="flex-1 flex flex-col items-center gap-1">
                  <span className="text-xs text-muted-foreground font-medium">{fmt(d.value)}</span>
                  <div
                    className="w-full rounded-t-md gradient-primary transition-all duration-500"
                    style={{ height: `${(d.value / maxVal) * 140}px` }}
                  />
                  <span className="text-xs text-muted-foreground">{d.month}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Top products */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="text-base">Mais Vendidos</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {mockTopProducts.map((p, i) => (
              <div key={p.name} className="flex items-center gap-3">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">{i + 1}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{p.name}</p>
                  <p className="text-xs text-muted-foreground">{p.sold} vendidos</p>
                </div>
                <span className="text-sm font-medium">{fmt(p.revenue)}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Recent orders */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="text-base">Pedidos Recentes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-muted-foreground">
                  <th className="text-left py-2 font-medium">Pedido</th>
                  <th className="text-left py-2 font-medium">Cliente</th>
                  <th className="text-left py-2 font-medium">Data</th>
                  <th className="text-left py-2 font-medium">Status</th>
                  <th className="text-right py-2 font-medium">Total</th>
                </tr>
              </thead>
              <tbody>
                {mockOrders.slice(0, 5).map((o) => (
                  <tr key={o.id} className="border-b last:border-0">
                    <td className="py-3 font-medium">{o.id}</td>
                    <td className="py-3">{o.customer}</td>
                    <td className="py-3 text-muted-foreground">{new Date(o.date).toLocaleDateString("pt-BR")}</td>
                    <td className="py-3">
                      <Badge variant="secondary" className={`${orderStatusColors[o.status]} border-0 text-xs`}>
                        {orderStatusLabels[o.status]}
                      </Badge>
                    </td>
                    <td className="py-3 text-right font-medium">{fmt(o.total)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
