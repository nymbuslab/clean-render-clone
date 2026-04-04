import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { mockProducts } from "@/data/mockData";
import { Minus, Plus, Trash2, ArrowRight, ShoppingCart } from "lucide-react";
import { Separator } from "@/components/ui/separator";

const cartItems = [
  { ...mockProducts[0], qty: 2 },
  { ...mockProducts[2], qty: 1 },
  { ...mockProducts[4], qty: 1 },
];

export default function CartPage() {
  const fmt = (v: number) => v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
  const subtotal = cartItems.reduce((s, i) => s + i.price * i.qty, 0);
  const shipping = 8;
  const total = subtotal + shipping;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6 flex items-center gap-2">
        <ShoppingCart className="h-6 w-6" /> Carrinho
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          {cartItems.map(item => (
            <div key={item.id} className="flex gap-4 rounded-xl border bg-card p-4">
              <img src={item.image} alt={item.name} className="h-24 w-24 rounded-lg object-cover" />
              <div className="flex-1">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-medium">{item.name}</p>
                    <p className="text-sm text-muted-foreground">Tamanho: M</p>
                  </div>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex items-center justify-between mt-3">
                  <div className="flex items-center rounded-lg border">
                    <button className="p-1.5 hover:bg-muted"><Minus className="h-3 w-3" /></button>
                    <span className="px-3 text-sm font-medium">{item.qty}</span>
                    <button className="p-1.5 hover:bg-muted"><Plus className="h-3 w-3" /></button>
                  </div>
                  <p className="font-bold text-primary">{fmt(item.price * item.qty)}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="rounded-xl border bg-card p-6 h-fit space-y-4">
          <h3 className="font-semibold">Resumo do Pedido</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between"><span className="text-muted-foreground">Subtotal</span><span>{fmt(subtotal)}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Entrega local</span><span>{fmt(shipping)}</span></div>
          </div>
          <Separator />
          <div className="flex justify-between font-bold text-lg">
            <span>Total</span><span className="text-primary">{fmt(total)}</span>
          </div>
          <p className="text-xs text-muted-foreground">ou 3x de {fmt(total / 3)} sem juros</p>
          <Link to="/loja/checkout">
            <Button className="w-full gradient-primary text-primary-foreground rounded-full" size="lg">
              Finalizar Compra <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
          <Link to="/loja">
            <Button variant="ghost" className="w-full text-sm">Continuar comprando</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
