import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { CreditCard, QrCode } from "lucide-react";

interface Props {
  payMethod: string;
  onPayMethodChange: (v: string) => void;
}

export default function PaymentSection({ payMethod, onPayMethodChange }: Props) {
  return (
    <div className="rounded-xl border bg-card p-6 space-y-4">
      <h3 className="font-semibold">Pagamento</h3>
      <RadioGroup value={payMethod} onValueChange={onPayMethodChange}>
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
          <RadioGroupItem value="credit_card" />
          <CreditCard className="h-5 w-5 text-primary" />
          <div>
            <p className="font-medium text-sm">Cartão de Crédito</p>
            <p className="text-xs text-muted-foreground">Até 3x sem juros</p>
          </div>
        </label>
      </RadioGroup>

      {payMethod === "credit_card" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          <div className="md:col-span-2 space-y-2"><Label>Número do cartão</Label><Input placeholder="0000 0000 0000 0000" /></div>
          <div className="space-y-2"><Label>Validade</Label><Input placeholder="MM/AA" /></div>
          <div className="space-y-2"><Label>CVV</Label><Input placeholder="123" /></div>
          <div className="md:col-span-2 space-y-2"><Label>Nome no cartão</Label><Input placeholder="Como está no cartão" /></div>
        </div>
      )}
    </div>
  );
}
