import { Search, Filter } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { mockOrders, orderStatusLabels, orderStatusColors } from "@/data/mockData";

export default function OrdersPage() {
  const fmt = (v: number) => v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Pedidos</h1>
        <p className="text-muted-foreground text-sm">{mockOrders.length} pedidos encontrados</p>
      </div>

      {/* Status summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
        {Object.entries(orderStatusLabels).map(([key, label]) => {
          const count = mockOrders.filter(o => o.status === key).length;
          return (
            <button key={key} className="rounded-lg border bg-card p-3 text-left hover:shadow-card transition-shadow">
              <p className="text-lg font-bold">{count}</p>
              <p className="text-xs text-muted-foreground truncate">{label}</p>
            </button>
          );
        })}
      </div>

      <Card className="shadow-card">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-3">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Buscar pedido..." className="pl-9 h-9" />
            </div>
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" /> Filtrar
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-muted-foreground">
                  <th className="text-left py-2 font-medium">Pedido</th>
                  <th className="text-left py-2 font-medium">Cliente</th>
                  <th className="text-left py-2 font-medium">Data</th>
                  <th className="text-center py-2 font-medium">Itens</th>
                  <th className="text-left py-2 font-medium">Status</th>
                  <th className="text-left py-2 font-medium">Pagamento</th>
                  <th className="text-right py-2 font-medium">Total</th>
                </tr>
              </thead>
              <tbody>
                {mockOrders.map((o) => (
                  <tr key={o.id} className="border-b last:border-0 hover:bg-muted/50 transition-colors cursor-pointer">
                    <td className="py-3 font-medium">{o.id}</td>
                    <td className="py-3">{o.customer}</td>
                    <td className="py-3 text-muted-foreground">{new Date(o.date).toLocaleDateString("pt-BR")}</td>
                    <td className="py-3 text-center">{o.items}</td>
                    <td className="py-3">
                      <Badge variant="secondary" className={`${orderStatusColors[o.status]} border-0 text-xs`}>
                        {orderStatusLabels[o.status]}
                      </Badge>
                    </td>
                    <td className="py-3">
                      <Badge variant="secondary" className={`border-0 text-xs ${
                        o.payment === "aprovado" ? "bg-success/10 text-success" : 
                        o.payment === "pendente" ? "bg-warning/10 text-warning" : "bg-destructive/10 text-destructive"
                      }`}>
                        {o.payment === "aprovado" ? "Aprovado" : o.payment === "pendente" ? "Pendente" : "Recusado"}
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
