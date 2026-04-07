import { useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Mail, Phone, MapPin, Calendar, ShoppingCart, DollarSign, Package, Edit2, Save, X, User } from "lucide-react";
import { enrichedOrders } from "@/data/ordersData";
import { orderStatusLabels, orderStatusColors } from "@/data/mockData";
import { toast } from "sonner";

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone?: string;
  cpf?: string;
  orders: number;
  totalSpent: number;
  lastOrder: string;
  status: string;
  address?: {
    street: string;
    number: string;
    complement?: string;
    neighborhood: string;
    city: string;
    state: string;
    zip: string;
  };
  notes?: string;
  createdAt?: string;
}

interface Props {
  customer: Customer | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave?: (customer: Customer) => void;
}

const fmt = (v: number) => v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

export default function CustomerDetailsSheet({ customer, open, onOpenChange, onSave }: Props) {
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState<Partial<Customer>>({});

  if (!customer) return null;

  const initials = customer.name.split(" ").map(n => n[0]).join("").slice(0, 2);
  const customerOrders = enrichedOrders.filter(o =>
    o.customer.toLowerCase() === customer.name.toLowerCase()
  );

  const startEdit = () => {
    setForm({ ...customer });
    setEditing(true);
  };

  const cancelEdit = () => {
    setForm({});
    setEditing(false);
  };

  const saveEdit = () => {
    if (onSave && form.name) {
      onSave({ ...customer, ...form } as Customer);
    }
    setEditing(false);
    toast.success("Cliente atualizado com sucesso!");
  };

  const statusBadge = (status: string) => {
    const cls = status === "ativo" ? "bg-success/10 text-success" :
      status === "novo" ? "bg-info/10 text-info" : "bg-muted text-muted-foreground";
    const label = status === "ativo" ? "Ativo" : status === "novo" ? "Novo" : "Inativo";
    return <Badge variant="secondary" className={`border-0 ${cls}`}>{label}</Badge>;
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-lg overflow-y-auto">
        <SheetHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Avatar className="h-12 w-12">
                <AvatarFallback className="bg-primary/10 text-primary font-semibold">{initials}</AvatarFallback>
              </Avatar>
              <div>
                <SheetTitle className="text-lg">{customer.name}</SheetTitle>
                <SheetDescription className="flex items-center gap-2">
                  {statusBadge(customer.status)}
                  <span className="text-xs text-muted-foreground">Cliente desde {customer.createdAt ? new Date(customer.createdAt).toLocaleDateString("pt-BR") : "—"}</span>
                </SheetDescription>
              </div>
            </div>
            {!editing ? (
              <Button variant="outline" size="sm" onClick={startEdit}>
                <Edit2 className="h-3.5 w-3.5 mr-1" /> Editar
              </Button>
            ) : (
              <div className="flex gap-1">
                <Button size="sm" onClick={saveEdit}><Save className="h-3.5 w-3.5 mr-1" /> Salvar</Button>
                <Button variant="ghost" size="sm" onClick={cancelEdit}><X className="h-3.5 w-3.5" /></Button>
              </div>
            )}
          </div>
        </SheetHeader>

        {/* KPI cards */}
        <div className="grid grid-cols-3 gap-3 mb-4">
          <div className="rounded-lg border p-3 text-center">
            <ShoppingCart className="h-4 w-4 mx-auto mb-1 text-muted-foreground" />
            <p className="text-lg font-bold">{customer.orders}</p>
            <p className="text-[10px] text-muted-foreground">Pedidos</p>
          </div>
          <div className="rounded-lg border p-3 text-center">
            <DollarSign className="h-4 w-4 mx-auto mb-1 text-muted-foreground" />
            <p className="text-sm font-bold">{fmt(customer.totalSpent)}</p>
            <p className="text-[10px] text-muted-foreground">Total Gasto</p>
          </div>
          <div className="rounded-lg border p-3 text-center">
            <Package className="h-4 w-4 mx-auto mb-1 text-muted-foreground" />
            <p className="text-sm font-bold">{customer.orders > 0 ? fmt(customer.totalSpent / customer.orders) : "—"}</p>
            <p className="text-[10px] text-muted-foreground">Ticket Médio</p>
          </div>
        </div>

        <Tabs defaultValue="info" className="w-full">
          <TabsList className="w-full grid grid-cols-3">
            <TabsTrigger value="info">Informações</TabsTrigger>
            <TabsTrigger value="orders">Pedidos ({customerOrders.length})</TabsTrigger>
            <TabsTrigger value="notes">Observações</TabsTrigger>
          </TabsList>

          {/* Info tab */}
          <TabsContent value="info" className="space-y-4 mt-4">
            {editing ? (
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div><Label>Nome</Label><Input value={form.name || ""} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} /></div>
                  <div><Label>Status</Label>
                    <Select value={form.status || customer.status} onValueChange={v => setForm(f => ({ ...f, status: v }))}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ativo">Ativo</SelectItem>
                        <SelectItem value="novo">Novo</SelectItem>
                        <SelectItem value="inativo">Inativo</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div><Label>E-mail</Label><Input value={form.email || ""} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} /></div>
                <div><Label>Telefone</Label><Input value={form.phone || ""} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} /></div>
                <div><Label>CPF</Label><Input value={form.cpf || ""} onChange={e => setForm(f => ({ ...f, cpf: e.target.value }))} /></div>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm"><Mail className="h-4 w-4 text-muted-foreground" />{customer.email}</div>
                <div className="flex items-center gap-2 text-sm"><Phone className="h-4 w-4 text-muted-foreground" />{customer.phone || "Não informado"}</div>
                <div className="flex items-center gap-2 text-sm"><User className="h-4 w-4 text-muted-foreground" />CPF: {customer.cpf || "Não informado"}</div>
                <Separator />
                <div className="flex items-start gap-2 text-sm">
                  <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                  {customer.address ? (
                    <span>{customer.address.street}, {customer.address.number}{customer.address.complement ? ` - ${customer.address.complement}` : ""}<br />{customer.address.neighborhood} - {customer.address.city}/{customer.address.state}<br />CEP: {customer.address.zip}</span>
                  ) : "Endereço não cadastrado"}
                </div>
                <Separator />
                <div className="flex items-center gap-2 text-sm"><Calendar className="h-4 w-4 text-muted-foreground" />Última compra: {new Date(customer.lastOrder).toLocaleDateString("pt-BR")}</div>
              </div>
            )}
          </TabsContent>

          {/* Orders tab */}
          <TabsContent value="orders" className="mt-4">
            {customerOrders.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">Nenhum pedido encontrado</p>
            ) : (
              <div className="space-y-3">
                {customerOrders.map(order => (
                  <div key={order.id} className="rounded-lg border p-3 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-sm">{order.id}</span>
                      <Badge variant="secondary" className={`border-0 text-xs ${orderStatusColors[order.status] || ""}`}>
                        {orderStatusLabels[order.status] || order.status}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>{new Date(order.date).toLocaleDateString("pt-BR")}</span>
                      <span className="font-medium text-foreground">{fmt(order.total)}</span>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {order.items.length} {order.items.length === 1 ? "item" : "itens"} • {order.paymentMethod}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Notes tab */}
          <TabsContent value="notes" className="mt-4">
            <Textarea
              placeholder="Adicione observações sobre este cliente..."
              className="min-h-[120px]"
              defaultValue={customer.notes || ""}
            />
            <Button size="sm" className="mt-2" onClick={() => toast.success("Observação salva!")}>
              Salvar Observação
            </Button>
          </TabsContent>
        </Tabs>
      </SheetContent>
    </Sheet>
  );
}
