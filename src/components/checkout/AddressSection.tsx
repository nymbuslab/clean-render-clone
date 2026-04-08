import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function AddressSection() {
  return (
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
  );
}
