import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CreditCard, QrCode } from "lucide-react";
import { CardData } from "@/hooks/useMercadoPago";

interface Props {
  payMethod: string;
  onPayMethodChange: (v: string) => void;
  cardData: CardData;
  onCardDataChange: (data: CardData) => void;
  installments: number;
  onInstallmentsChange: (v: number) => void;
  installmentOptions?: { installments: number; recommended_message: string }[];
}

export default function PaymentSection({
  payMethod,
  onPayMethodChange,
  cardData,
  onCardDataChange,
  installments,
  onInstallmentsChange,
  installmentOptions,
}: Props) {
  const updateField = (field: keyof CardData, value: string) => {
    onCardDataChange({ ...cardData, [field]: value });
  };

  const formatCardNumber = (value: string) => {
    const digits = value.replace(/\D/g, "").slice(0, 16);
    return digits.replace(/(.{4})/g, "$1 ").trim();
  };

  const formatExpiration = (value: string) => {
    const digits = value.replace(/\D/g, "").slice(0, 4);
    if (digits.length > 2) return digits.slice(0, 2) + "/" + digits.slice(2);
    return digits;
  };

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
          <div className="md:col-span-2 space-y-2">
            <Label>Número do cartão</Label>
            <Input
              placeholder="0000 0000 0000 0000"
              value={formatCardNumber(cardData.cardNumber)}
              onChange={(e) => updateField("cardNumber", e.target.value.replace(/\D/g, ""))}
              maxLength={19}
            />
          </div>
          <div className="space-y-2">
            <Label>Validade</Label>
            <Input
              placeholder="MM/AA"
              value={formatExpiration(cardData.expirationMonth + cardData.expirationYear)}
              onChange={(e) => {
                const digits = e.target.value.replace(/\D/g, "").slice(0, 4);
                updateField("expirationMonth", digits.slice(0, 2));
                onCardDataChange({
                  ...cardData,
                  expirationMonth: digits.slice(0, 2),
                  expirationYear: digits.slice(2, 4),
                });
              }}
              maxLength={5}
            />
          </div>
          <div className="space-y-2">
            <Label>CVV</Label>
            <Input
              placeholder="123"
              value={cardData.securityCode}
              onChange={(e) => updateField("securityCode", e.target.value.replace(/\D/g, "").slice(0, 4))}
              maxLength={4}
              type="password"
            />
          </div>
          <div className="md:col-span-2 space-y-2">
            <Label>Nome no cartão</Label>
            <Input
              placeholder="Como está no cartão"
              value={cardData.cardholderName}
              onChange={(e) => updateField("cardholderName", e.target.value.toUpperCase())}
            />
          </div>
          {installmentOptions && installmentOptions.length > 0 && (
            <div className="md:col-span-2 space-y-2">
              <Label>Parcelas</Label>
              <Select
                value={String(installments)}
                onValueChange={(v) => onInstallmentsChange(Number(v))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione as parcelas" />
                </SelectTrigger>
                <SelectContent>
                  {installmentOptions.map((opt) => (
                    <SelectItem key={opt.installments} value={String(opt.installments)}>
                      {opt.recommended_message}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
