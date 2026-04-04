import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { mockProducts } from "@/data/mockData";
import { Lock, CreditCard, QrCode } from "lucide-react";
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
  const total = subtotal + shipping;
  const [payMethod, setPayMethod] = useState("pix");

  return (
    <div className="container mx-auto px-4 py-8">
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
                <div>
                  <p className="font-medium text-sm">Pix</p>
                  <p className="text-xs text-muted-foreground">Aprovação imediata</p>
                </div>
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

        {/* Summary */}
        <div className="h-fit sticky top-20 space-y-4">
          <div className="rounded-xl border bg-card p-6 space-y-4">
            <h3 className="font-semibold">Resumo</h3>
            <div className="space-y-3">
              {cartItems.map(i => (
                <div key={i.id} className="flex items-center gap-3">
                  <img src={i.image} alt={i.name} className="h-12 w-12 rounded-lg object-cover" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{i.name}</p>
                    <p className="text-xs text-muted-foreground">Qtd: {i.qty}</p>
                  </div>
                  <p className="text-sm font-medium">{fmt(i.price * i.qty)}</p>
                </div>
              ))}
            </div>
            <Separator />
            <div className="space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-muted-foreground">Subtotal</span><span>{fmt(subtotal)}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Frete</span><span>{fmt(shipping)}</span></div>
            </div>
            <Separator />
            <div className="flex justify-between font-bold text-lg">
              <span>Total</span><span className="text-primary">{fmt(total)}</span>
            </div>
            <Button className="w-full gradient-primary text-primary-foreground rounded-full" size="lg">
              <Lock className="h-4 w-4 mr-2" /> Finalizar Pedido
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
