import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { mockProducts } from "@/data/mockData";
import { Minus, Plus, Trash2, ArrowRight, ShoppingCart, ShieldCheck, Lock, Truck, Tag } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { useState } from "react";

const initialCartItems = [
  { ...mockProducts[0], qty: 2 },
  { ...mockProducts[2], qty: 1 },
  { ...mockProducts[4], qty: 1 },
];

export default function CartPage() {
  const fmt = (v: number) => v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
  const [cartItems] = useState(initialCartItems);
  const [coupon, setCoupon] = useState("");

  const subtotal = cartItems.reduce((s, i) => s + i.price * i.qty, 0);
  const shipping = 8;
  const total = subtotal + shipping;
  const totalItems = cartItems.reduce((s, i) => s + i.qty, 0);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <ShoppingCart className="h-6 w-6" /> Carrinho
        </h1>
        <Badge variant="secondary" className="text-sm">
          {totalItems} {totalItems === 1 ? "item" : "itens"}
        </Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {/* Header row - desktop */}
          <div className="hidden md:grid grid-cols-[1fr_120px_120px_40px] gap-4 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wider">
            <span>Produto</span>
            <span className="text-center">Quantidade</span>
            <span className="text-right">Total</span>
            <span />
          </div>

          {cartItems.map(item => (
            <div key={item.id} className="rounded-xl border bg-card p-4 md:p-5 transition-shadow hover:shadow-card">
              <div className="flex gap-4 md:grid md:grid-cols-[1fr_120px_120px_40px] md:items-center">
                {/* Product info */}
                <div className="flex gap-4 flex-1 min-w-0">
                  <div className="relative shrink-0">
                    <img src={item.image} alt={item.name} className="h-20 w-20 md:h-24 md:w-24 rounded-lg object-cover border" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{item.name}</p>
                    <p className="text-sm text-muted-foreground mt-0.5">{item.category}</p>
                    <p className="text-sm text-muted-foreground">Tam: M</p>
                    <p className="text-sm font-medium mt-1 md:hidden">{fmt(item.price)} / un.</p>
                  </div>
                </div>

                {/* Quantity - mobile inline, desktop centered */}
                <div className="flex items-center md:justify-center mt-3 md:mt-0">
                  <div className="flex items-center rounded-lg border bg-background">
                    <button className="p-2 hover:bg-muted rounded-l-lg transition-colors">
                      <Minus className="h-3.5 w-3.5" />
                    </button>
                    <span className="px-4 text-sm font-semibold min-w-[2rem] text-center">{item.qty}</span>
                    <button className="p-2 hover:bg-muted rounded-r-lg transition-colors">
                      <Plus className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>

                {/* Price */}
                <div className="hidden md:block text-right">
                  <p className="font-bold text-primary">{fmt(item.price * item.qty)}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{fmt(item.price)} / un.</p>
                </div>

                {/* Remove */}
                <div className="hidden md:flex justify-end">
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-full">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>

                {/* Mobile price + remove */}
                <div className="flex items-center justify-between md:hidden mt-3 w-full">
                  <p className="font-bold text-primary text-lg">{fmt(item.price * item.qty)}</p>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-full">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}

          <Link to="/loja">
            <Button variant="ghost" className="text-sm text-muted-foreground hover:text-foreground">
              <ArrowRight className="mr-2 h-4 w-4 rotate-180" /> Continuar comprando
            </Button>
          </Link>
        </div>

        {/* Summary */}
        <div className="h-fit sticky top-20 space-y-4">
          <div className="rounded-xl border bg-card overflow-hidden">
            <div className="bg-muted/50 px-6 py-4 border-b">
              <h3 className="font-semibold text-base">Resumo do Pedido</h3>
            </div>

            {/* Coupon */}
            <div className="px-6 py-4">
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Tag className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                  <Input
                    placeholder="Cupom de desconto"
                    className="pl-9 h-9 text-sm"
                    value={coupon}
                    onChange={e => setCoupon(e.target.value)}
                  />
                </div>
                <Button variant="outline" size="sm" className="h-9 px-4 text-xs font-medium">
                  Aplicar
                </Button>
              </div>
            </div>

            <Separator />

            {/* Totals */}
            <div className="px-6 py-4 space-y-2.5">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal ({totalItems} itens)</span>
                <span>{fmt(subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground flex items-center gap-1.5">
                  <Truck className="h-3.5 w-3.5" /> Frete estimado
                </span>
                <span>{fmt(shipping)}</span>
              </div>
            </div>

            <Separator />

            <div className="px-6 py-5 space-y-4">
              <div className="flex justify-between items-baseline">
                <span className="font-bold text-lg">Total</span>
                <div className="text-right">
                  <span className="font-bold text-xl text-primary">{fmt(total)}</span>
                  <p className="text-xs text-muted-foreground mt-0.5">ou 3x de {fmt(total / 3)} sem juros</p>
                </div>
              </div>

              <Link to="/loja/checkout">
                <Button className="w-full gradient-primary text-primary-foreground rounded-full h-12 text-base font-semibold" size="lg">
                  Finalizar Compra <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>

              {/* Trust badges */}
              <div className="flex items-center justify-center gap-4 pt-1">
                <div className="flex items-center gap-1 text-muted-foreground">
                  <ShieldCheck className="h-3.5 w-3.5" />
                  <span className="text-[10px]">Compra Segura</span>
                </div>
                <div className="flex items-center gap-1 text-muted-foreground">
                  <Lock className="h-3.5 w-3.5" />
                  <span className="text-[10px]">Dados Protegidos</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
