import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface PayerData {
  name: string;
  email: string;
  cpf: string;
  phone: string;
}

interface Props {
  payer: PayerData;
  onChange: (payer: PayerData) => void;
}

export default function PersonalInfoSection({ payer, onChange }: Props) {
  const update = (field: keyof PayerData, value: string) => {
    onChange({ ...payer, [field]: value });
  };

  return (
    <div className="rounded-xl border bg-card p-6 space-y-4">
      <h3 className="font-semibold">Dados Pessoais</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Nome completo</Label>
          <Input placeholder="Seu nome" value={payer.name} onChange={e => update("name", e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label>E-mail</Label>
          <Input type="email" placeholder="seu@email.com" value={payer.email} onChange={e => update("email", e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label>CPF</Label>
          <Input placeholder="000.000.000-00" value={payer.cpf} onChange={e => update("cpf", e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label>Telefone</Label>
          <Input placeholder="(00) 00000-0000" value={payer.phone} onChange={e => update("phone", e.target.value)} />
        </div>
      </div>
    </div>
  );
}
