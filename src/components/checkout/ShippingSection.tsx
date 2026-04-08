import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface Props {
  shipping: number;
  fmt: (v: number) => string;
}

export default function ShippingSection({ shipping, fmt }: Props) {
  return (
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
  );
}
