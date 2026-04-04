import { Search, Mail, ShoppingCart } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { mockCustomers } from "@/data/mockData";

export default function CustomersPage() {
  const fmt = (v: number) => v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Clientes</h1>
        <p className="text-muted-foreground text-sm">{mockCustomers.length} clientes cadastrados</p>
      </div>

      <Card className="shadow-card">
        <CardHeader className="pb-3">
          <div className="relative max-w-sm">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Buscar cliente..." className="pl-9 h-9" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {mockCustomers.map((c) => (
              <div key={c.id} className="rounded-xl border p-4 hover:shadow-card transition-shadow cursor-pointer">
                <div className="flex items-center gap-3 mb-3">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback className="bg-primary/10 text-primary text-sm font-medium">
                      {c.name.split(" ").map(n => n[0]).join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{c.name}</p>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Mail className="h-3 w-3" />
                      <span className="truncate">{c.email}</span>
                    </div>
                  </div>
                  <Badge variant="secondary" className={`text-xs border-0 ${
                    c.status === "ativo" ? "bg-success/10 text-success" : 
                    c.status === "novo" ? "bg-info/10 text-info" : "bg-muted text-muted-foreground"
                  }`}>
                    {c.status === "ativo" ? "Ativo" : c.status === "novo" ? "Novo" : "Inativo"}
                  </Badge>
                </div>
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="rounded-lg bg-muted p-2">
                    <p className="text-lg font-bold">{c.orders}</p>
                    <p className="text-[10px] text-muted-foreground">Pedidos</p>
                  </div>
                  <div className="rounded-lg bg-muted p-2">
                    <p className="text-sm font-bold">{fmt(c.totalSpent)}</p>
                    <p className="text-[10px] text-muted-foreground">Total Gasto</p>
                  </div>
                  <div className="rounded-lg bg-muted p-2">
                    <p className="text-sm font-medium">{new Date(c.lastOrder).toLocaleDateString("pt-BR", { day: "2-digit", month: "short" })}</p>
                    <p className="text-[10px] text-muted-foreground">Última Compra</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
