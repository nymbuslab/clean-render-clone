import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DollarSign, CreditCard, AlertCircle } from "lucide-react";
import { mockOrders } from "@/data/mockData";

export default function PaymentsPage() {
  const fmt = (v: number) => v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
  const approved = mockOrders.filter(o => o.payment === "aprovado");
  const pending = mockOrders.filter(o => o.payment === "pendente");
  const refused = mockOrders.filter(o => o.payment === "recusado");
  const totalApproved = approved.reduce((s, o) => s + o.total, 0);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Pagamentos</h1>
        <p className="text-muted-foreground text-sm">Acompanhe os pagamentos dos pedidos</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="shadow-card">
          <CardContent className="p-5 flex items-center gap-4">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-success/10">
              <DollarSign className="h-5 w-5 text-success" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Aprovados</p>
              <p className="text-xl font-bold">{fmt(totalApproved)}</p>
              <p className="text-xs text-muted-foreground">{approved.length} pedidos</p>
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-card">
          <CardContent className="p-5 flex items-center gap-4">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-warning/10">
              <CreditCard className="h-5 w-5 text-warning" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Pendentes</p>
              <p className="text-xl font-bold">{pending.length}</p>
              <p className="text-xs text-muted-foreground">aguardando</p>
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-card">
          <CardContent className="p-5 flex items-center gap-4">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-destructive/10">
              <AlertCircle className="h-5 w-5 text-destructive" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Recusados</p>
              <p className="text-xl font-bold">{refused.length}</p>
              <p className="text-xs text-muted-foreground">falha no pagamento</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-card">
        <CardHeader><CardTitle className="text-base">Histórico de Pagamentos</CardTitle></CardHeader>
        <CardContent>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-muted-foreground">
                <th className="text-left py-2 font-medium">Pedido</th>
                <th className="text-left py-2 font-medium">Cliente</th>
                <th className="text-left py-2 font-medium">Status</th>
                <th className="text-right py-2 font-medium">Valor</th>
              </tr>
            </thead>
            <tbody>
              {mockOrders.map(o => (
                <tr key={o.id} className="border-b last:border-0">
                  <td className="py-3 font-medium">{o.id}</td>
                  <td className="py-3">{o.customer}</td>
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
        </CardContent>
      </Card>
    </div>
  );
}
