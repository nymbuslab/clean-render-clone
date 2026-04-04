import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Truck, Package, CheckCircle, XCircle } from "lucide-react";
import { mockOrders, orderStatusLabels } from "@/data/mockData";

const shippingSteps = [
  { key: "em_separacao", label: "Em Separação", icon: Package },
  { key: "pronto_entrega", label: "Pronto p/ Entrega", icon: Package },
  { key: "saiu_entrega", label: "Saiu p/ Entrega", icon: Truck },
  { key: "entregue", label: "Entregue", icon: CheckCircle },
];

export default function ShippingPage() {
  const shippingOrders = mockOrders.filter(o => 
    ["em_separacao", "pronto_entrega", "saiu_entrega", "entregue"].includes(o.status)
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Envios</h1>
        <p className="text-muted-foreground text-sm">Acompanhe o status dos envios</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {shippingSteps.map(s => {
          const count = mockOrders.filter(o => o.status === s.key).length;
          return (
            <Card key={s.key} className="shadow-card">
              <CardContent className="p-4 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <s.icon className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{count}</p>
                  <p className="text-xs text-muted-foreground">{s.label}</p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card className="shadow-card">
        <CardHeader><CardTitle className="text-base">Pedidos em Logística</CardTitle></CardHeader>
        <CardContent>
          <div className="space-y-3">
            {shippingOrders.map(o => (
              <div key={o.id} className="flex items-center justify-between rounded-lg border p-4 hover:bg-muted/50 transition-colors">
                <div className="flex items-center gap-4">
                  <span className="font-medium">{o.id}</span>
                  <span className="text-sm text-muted-foreground">{o.customer}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant="secondary" className="text-xs border-0 bg-primary/10 text-primary">
                    {orderStatusLabels[o.status]}
                  </Badge>
                  <span className="text-sm text-muted-foreground">{new Date(o.date).toLocaleDateString("pt-BR")}</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
