import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Lock, ShieldCheck, Truck, Tag, Loader2 } from "lucide-react";

interface CartItem {
  id: string;
  name: string;
  price: number;
  image: string;
  qty: number;
}

interface Props {
  cartItems: CartItem[];
  subtotal: number;
  shipping: number;
  discount: number;
  total: number;
  payMethod: string;
  coupon: string;
  onCouponChange: (v: string) => void;
  onSubmit: () => void;
  isProcessing: boolean;
  fmt: (v: number) => string;
}

export default function OrderSummary({
  cartItems, subtotal, shipping, discount, total, payMethod,
  coupon, onCouponChange, onSubmit, isProcessing, fmt,
}: Props) {
  const totalItems = cartItems.reduce((s, i) => s + i.qty, 0);

  return (
    <div className="h-fit sticky top-20 space-y-4">
      <div className="rounded-xl border bg-card overflow-hidden">
        <div className="bg-muted/50 px-6 py-4 border-b">
          <h3 className="font-semibold text-base">Resumo do Pedido</h3>
          <p className="text-xs text-muted-foreground mt-0.5">{totalItems} {totalItems === 1 ? "item" : "itens"}</p>
        </div>

        <div className="px-6 py-4 space-y-4">
          {cartItems.map(i => (
            <div key={i.id} className="flex items-start gap-3">
              <div className="relative">
                <img src={i.image} alt={i.name} className="h-16 w-16 rounded-lg object-cover border" />
                <span className="absolute -top-1.5 -right-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-primary-foreground text-[10px] font-bold">
                  {i.qty}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium leading-tight truncate">{i.name}</p>
                <p className="text-xs text-muted-foreground mt-0.5">Tam: M</p>
                <p className="text-xs text-muted-foreground">Unit: {fmt(i.price)}</p>
              </div>
              <p className="text-sm font-semibold whitespace-nowrap">{fmt(i.price * i.qty)}</p>
            </div>
          ))}
        </div>

        <Separator />

        <div className="px-6 py-4">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Tag className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
              <Input
                placeholder="Cupom de desconto"
                className="pl-9 h-9 text-sm"
                value={coupon}
                onChange={e => onCouponChange(e.target.value)}
              />
            </div>
            <Button variant="outline" size="sm" className="h-9 px-4 text-xs font-medium">
              Aplicar
            </Button>
          </div>
        </div>

        <Separator />

        <div className="px-6 py-4 space-y-2.5">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Subtotal</span>
            <span>{fmt(subtotal)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground flex items-center gap-1.5">
              <Truck className="h-3.5 w-3.5" /> Frete
            </span>
            <span>{fmt(shipping)}</span>
          </div>
          {discount > 0 && (
            <div className="flex justify-between text-sm text-success">
              <span>Desconto</span>
              <span>-{fmt(discount)}</span>
            </div>
          )}
        </div>

        <Separator />

        <div className="px-6 py-5 space-y-4">
          <div className="flex justify-between items-baseline">
            <span className="font-bold text-lg">Total</span>
            <div className="text-right">
              <span className="font-bold text-xl text-primary">{fmt(total)}</span>
              {payMethod === "credit_card" && (
                <p className="text-xs text-muted-foreground mt-0.5">ou 3x de {fmt(total / 3)}</p>
              )}
              {payMethod === "pix" && (
                <p className="text-xs text-success mt-0.5 font-medium">
                  {fmt(total * 0.95)} no Pix
                </p>
              )}
            </div>
          </div>

          <Button
            className="w-full gradient-primary text-primary-foreground rounded-full h-12 text-base font-semibold"
            size="lg"
            onClick={onSubmit}
            disabled={isProcessing}
          >
            {isProcessing ? (
              <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Processando...</>
            ) : (
              <><Lock className="h-4 w-4 mr-2" /> Finalizar Pedido</>
            )}
          </Button>

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
  );
}
