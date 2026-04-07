import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import type { Customer } from "./CustomerDetailsSheet";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (customer: Customer) => void;
}

export default function CustomerFormDialog({ open, onOpenChange, onSave }: Props) {
  const [form, setForm] = useState({
    name: "", email: "", phone: "", cpf: "", status: "novo",
    street: "", number: "", complement: "", neighborhood: "", city: "", state: "", zip: "",
  });

  const handleSave = () => {
    if (!form.name.trim() || !form.email.trim()) {
      toast.error("Nome e e-mail são obrigatórios");
      return;
    }
    const newCustomer: Customer = {
      id: crypto.randomUUID(),
      name: form.name.trim(),
      email: form.email.trim(),
      phone: form.phone || undefined,
      cpf: form.cpf || undefined,
      orders: 0,
      totalSpent: 0,
      lastOrder: new Date().toISOString(),
      status: form.status,
      createdAt: new Date().toISOString(),
      address: form.street ? {
        street: form.street, number: form.number, complement: form.complement || undefined,
        neighborhood: form.neighborhood, city: form.city, state: form.state, zip: form.zip,
      } : undefined,
    };
    onSave(newCustomer);
    setForm({ name: "", email: "", phone: "", cpf: "", status: "novo", street: "", number: "", complement: "", neighborhood: "", city: "", state: "", zip: "" });
    onOpenChange(false);
    toast.success("Cliente cadastrado com sucesso!");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Novo Cliente</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div><Label>Nome *</Label><Input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Nome completo" /></div>
            <div><Label>Status</Label>
              <Select value={form.status} onValueChange={v => setForm(f => ({ ...f, status: v }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="ativo">Ativo</SelectItem>
                  <SelectItem value="novo">Novo</SelectItem>
                  <SelectItem value="inativo">Inativo</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div><Label>E-mail *</Label><Input type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} placeholder="email@exemplo.com" /></div>
          <div className="grid grid-cols-2 gap-3">
            <div><Label>Telefone</Label><Input value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} placeholder="(00) 00000-0000" /></div>
            <div><Label>CPF</Label><Input value={form.cpf} onChange={e => setForm(f => ({ ...f, cpf: e.target.value }))} placeholder="000.000.000-00" /></div>
          </div>
          <p className="text-sm font-medium text-muted-foreground pt-2">Endereço (opcional)</p>
          <div className="grid grid-cols-3 gap-3">
            <div className="col-span-2"><Label>Rua</Label><Input value={form.street} onChange={e => setForm(f => ({ ...f, street: e.target.value }))} /></div>
            <div><Label>Número</Label><Input value={form.number} onChange={e => setForm(f => ({ ...f, number: e.target.value }))} /></div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div><Label>Complemento</Label><Input value={form.complement} onChange={e => setForm(f => ({ ...f, complement: e.target.value }))} /></div>
            <div><Label>Bairro</Label><Input value={form.neighborhood} onChange={e => setForm(f => ({ ...f, neighborhood: e.target.value }))} /></div>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div><Label>Cidade</Label><Input value={form.city} onChange={e => setForm(f => ({ ...f, city: e.target.value }))} /></div>
            <div><Label>Estado</Label><Input value={form.state} onChange={e => setForm(f => ({ ...f, state: e.target.value }))} /></div>
            <div><Label>CEP</Label><Input value={form.zip} onChange={e => setForm(f => ({ ...f, zip: e.target.value }))} /></div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancelar</Button>
          <Button onClick={handleSave}>Cadastrar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
