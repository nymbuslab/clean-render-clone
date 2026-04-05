import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { mockProducts } from "@/data/mockData";
import { Lock, CreditCard, QrCode, ShieldCheck, Truck, Tag, ChevronRight } from "lucide-react";
import { useState } from "react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

const cartItems = [
  { ...mockProducts[0], qty: 2 },
  { ...mockProducts[2], qty: 1 },
  { ...mockProducts[4], qty: 1 },
];

export default function CheckoutPage() {
  const fmt = (v: number) => v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
  const subtotal = cartItems.reduce((s, i) => s + i.price * i.qty, 0);
  const shipping = 8;
  const discount = 0;
  const total = subtotal + shipping - discount;
  const [payMethod, setPayMethod] = useState("pix");
  const [coupon, setCoupon] = useState("");

  const totalItems = cartItems.reduce((s, i) => s + i.qty, 0);

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Progress steps */}
      <div className="flex items-center justify-center gap-2 mb-8 text-sm">
        <span className="flex items-center gap-1.5 text-muted-foreground">
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-muted text-xs font-medium">1</span>
          Carrinho
        </span>
        <ChevronRight className="h-4 w-4 text-muted-foreground/50" />
        <span className="flex items-center gap-1.5 text-primary font-medium">
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-medium">2</span>
          Checkout
        </span>
        <ChevronRight className="h-4 w-4 text-muted-foreground/50" />
        <span className="flex items-center gap-1.5 text-muted-foreground">
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-muted text-xs font-medium">3</span>
          Confirmação
        </span>
      </div>

      <div className="flex items-center gap-2 mb-6">
        <Lock className="h-5 w-5 text-success" />
        <h1 className="text-2xl font-bold">Checkout Seguro</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {/* Personal info */}
          <div className="rounded-xl border bg-card p-6 space-y-4">
            <h3 className="font-semibold">Dados Pessoais</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2"><Label>Nome completo</Label><Input placeholder="Seu nome" /></div>
              <div className="space-y-2"><Label>E-mail</Label><Input type="email" placeholder="seu@email.com" /></div>
              <div className="space-y-2"><Label>CPF</Label><Input placeholder="000.000.000-00" /></div>
              <div className="space-y-2"><Label>Telefone</Label><Input placeholder="(00) 00000-0000" /></div>
            </div>
          </div>

          {/* Address */}
          <div className="rounded-xl border bg-card p-6 space-y-4">
            <h3 className="font-semibold">Endereço de Entrega</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2"><Label>CEP</Label><Input placeholder="00000-000" /></div>
              <div className="md:col-span-2 space-y-2"><Label>Rua</Label><Input placeholder="Nome da rua" /></div>
              <div className="space-y-2"><Label>Número</Label><Input placeholder="123" /></div>
              <div className="space-y-2"><Label>Complemento</Label><Input placeholder="Apto, bloco..." /></div>
              <div className="space-y-2"><Label>Bairro</Label><Input placeholder="Bairro" /></div>
              <div className="space-y-2"><Label>Cidade</Label><Input placeholder="Cidade" /></div>
              <div className="space-y-2"><Label>Estado</Label><Input placeholder="SP" /></div>
            </div>
          </div>

          {/* Shipping */}
          <div className="rounded-xl border bg-card p-6 space-y-4">
            <h3 className="font-semibold">Entrega</h3>
            <RadioGroup defaultValue="local">
              <label className="flex items-center justify-between rounded-lg border p-4 cursor-pointer has-[:checked]:border-primary has-[:checked]:bg-primary/5">
                <div className="flex items-center gap-3">
                  <RadioGroupItem value="local" />
                  <div>
                    <p className="font-medium text-sm">Entrega local</p>
                    <p className="text-xs text-muted-foreground">2-3 dias úteis</p>
                  </div>
                </div>
                <span className="font-medium text-sm">{fmt(shipping)}</span>
              </label>
              <label className="flex items-center justify-between rounded-lg border p-4 cursor-pointer has-[:checked]:border-primary has-[:checked]:bg-primary/5">
                <div className="flex items-center gap-3">
                  <RadioGroupItem value="pickup" />
                  <div>
                    <p className="font-medium text-sm">Retirada na loja</p>
                    <p className="text-xs text-muted-foreground">Disponível em 1 dia</p>
                  </div>
                </div>
                <span className="font-medium text-sm text-success">Grátis</span>
              </label>
            </RadioGroup>
          </div>

          {/* Payment */}
          <div className="rounded-xl border bg-card p-6 space-y-4">
            <h3 className="font-semibold">Pagamento</h3>
            <RadioGroup value={payMethod} onValueChange={setPayMethod}>
              <label className="flex items-center gap-3 rounded-lg border p-4 cursor-pointer has-[:checked]:border-primary has-[:checked]:bg-primary/5">
                <RadioGroupItem value="pix" />
                <QrCode className="h-5 w-5 text-success" />
                <div className="flex-1">
                  <p className="font-medium text-sm">Pix</p>
                  <p className="text-xs text-muted-foreground">Aprovação imediata</p>
                </div>
                <Badge variant="secondary" className="text-xs bg-success/10 text-success border-0">5% off</Badge>
              </label>
              <label className="flex items-center gap-3 rounded-lg border p-4 cursor-pointer has-[:checked]:border-primary has-[:checked]:bg-primary/5">
                <RadioGroupItem value="card" />
                <CreditCard className="h-5 w-5 text-primary" />
                <div>
                  <p className="font-medium text-sm">Cartão de Crédito</p>
                  <p className="text-xs text-muted-foreground">Até 3x sem juros</p>
                </div>
              </label>
            </RadioGroup>

            {payMethod === "card" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                <div className="md:col-span-2 space-y-2"><Label>Número do cartão</Label><Input placeholder="0000 0000 0000 0000" /></div>
                <div className="space-y-2"><Label>Validade</Label><Input placeholder="MM/AA" /></div>
                <div className="space-y-2"><Label>CVV</Label><Input placeholder="123" /></div>
                <div className="md:col-span-2 space-y-2"><Label>Nome no cartão</Label><Input placeholder="Como está no cartão" /></div>
              </div>
            )}
          </div>
        </div>

        {/* Summary - Redesigned */}
        <div className="h-fit sticky top-20 space-y-4">
          <div className="rounded-xl border bg-card overflow-hidden">
            {/* Header */}
            <div className="bg-muted/50 px-6 py-4 border-b">
              <h3 className="font-semibold text-base">Resumo do Pedido</h3>
              <p className="text-xs text-muted-foreground mt-0.5">{totalItems} {totalItems === 1 ? "item" : "itens"}</p>
            </div>

            {/* Items */}
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

            {/* Total + CTA */}
            <div className="px-6 py-5 space-y-4">
              <div className="flex justify-between items-baseline">
                <span className="font-bold text-lg">Total</span>
                <div className="text-right">
                  <span className="font-bold text-xl text-primary">{fmt(total)}</span>
                  {payMethod === "card" && (
                    <p className="text-xs text-muted-foreground mt-0.5">ou 3x de {fmt(total / 3)}</p>
                  )}
                  {payMethod === "pix" && (
                    <p className="text-xs text-success mt-0.5 font-medium">
                      {fmt(total * 0.95)} no Pix
                    </p>
                  )}
                </div>
              </div>

              <Button className="w-full gradient-primary text-primary-foreground rounded-full h-12 text-base font-semibold" size="lg">
                <Lock className="h-4 w-4 mr-2" /> Finalizar Pedido
              </Button>

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
