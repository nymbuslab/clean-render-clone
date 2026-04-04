import { Plus, Search, MoreHorizontal } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { mockProducts } from "@/data/mockData";

export default function ProductsPage() {
  const fmt = (v: number) => v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Produtos</h1>
          <p className="text-muted-foreground text-sm">{mockProducts.length} produtos cadastrados</p>
        </div>
        <Button className="gradient-primary text-primary-foreground">
          <Plus className="h-4 w-4 mr-2" /> Novo Produto
        </Button>
      </div>

      <Card className="shadow-card">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-3">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Buscar produto..." className="pl-9 h-9" />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-muted-foreground">
                  <th className="text-left py-2 font-medium">Produto</th>
                  <th className="text-left py-2 font-medium">Categoria</th>
                  <th className="text-right py-2 font-medium">Preço</th>
                  <th className="text-right py-2 font-medium">Estoque</th>
                  <th className="text-center py-2 font-medium">Status</th>
                  <th className="py-2 w-10"></th>
                </tr>
              </thead>
              <tbody>
                {mockProducts.map((p) => (
                  <tr key={p.id} className="border-b last:border-0 hover:bg-muted/50 transition-colors">
                    <td className="py-3">
                      <div className="flex items-center gap-3">
                        <img src={p.image} alt={p.name} className="h-10 w-10 rounded-lg object-cover" />
                        <span className="font-medium">{p.name}</span>
                      </div>
                    </td>
                    <td className="py-3 text-muted-foreground">{p.category}</td>
                    <td className="py-3 text-right font-medium">{fmt(p.price)}</td>
                    <td className="py-3 text-right">
                      <span className={p.stock === 0 ? "text-destructive font-medium" : ""}>
                        {p.stock === 0 ? "Esgotado" : p.stock}
                      </span>
                    </td>
                    <td className="py-3 text-center">
                      <Badge variant="secondary" className={`text-xs border-0 ${p.status === "active" ? "bg-success/10 text-success" : "bg-muted text-muted-foreground"}`}>
                        {p.status === "active" ? "Ativo" : "Inativo"}
                      </Badge>
                    </td>
                    <td className="py-3">
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </td>
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
