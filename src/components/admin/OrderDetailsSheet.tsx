import { useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  User,
  Mail,
  Phone,
  MapPin,
  CreditCard,
  Truck,
  Package,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Copy,
  Printer,
  MessageSquare,
} from "lucide-react";
import { type Order } from "@/data/ordersData";
import { orderStatusLabels, orderStatusColors } from "@/data/mockData";
import { useToast } from "@/hooks/use-toast";

const statusFlow = [
  "aguardando_pagamento",
  "pago",
  "em_separacao",
  "pronto_entrega",
  "saiu_entrega",
  "entregue",
];

const statusIcons: Record<string, React.ReactNode> = {
  aguardando_pagamento: <Clock className="h-4 w-4" />,
  pago: <CheckCircle2 className="h-4 w-4" />,
  em_separacao: <Package className="h-4 w-4" />,
  pronto_entrega: <Package className="h-4 w-4" />,
  saiu_entrega: <Truck className="h-4 w-4" />,
  entregue: <CheckCircle2 className="h-4 w-4" />,
  cancelado: <XCircle className="h-4 w-4" />,
};

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  order: Order | null;
  onUpdateStatus: (orderId: string, newStatus: string, note?: string) => void;
  onAddNote: (orderId: string, note: string) => void;
  onUpdateTracking: (orderId: string, tracking: string) => void;
}

export default function OrderDetailsSheet({
  open,
  onOpenChange,
  order,
  onUpdateStatus,
  onAddNote,
  onUpdateTracking,
}: Props) {
  const { toast } = useToast();
  const [statusNote, setStatusNote] = useState("");
  const [newNote, setNewNote] = useState("");
  const [trackingInput, setTrackingInput] = useState("");
  const [showNoteInput, setShowNoteInput] = useState(false);

  if (!order) return null;

  const fmt = (v: number) =>
    v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
  const fmtDate = (d: string) =>
    new Date(d).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  const currentIdx = statusFlow.indexOf(order.status);
  const nextStatus =
    order.status !== "cancelado" && currentIdx < statusFlow.length - 1
      ? statusFlow[currentIdx + 1]
      : null;

  const canCancel = !["entregue", "cancelado"].includes(order.status);

  const handleAdvance = () => {
    if (!nextStatus) return;
    onUpdateStatus(order.id, nextStatus, statusNote || undefined);
    setStatusNote("");
    toast({
      title: "Status atualizado",
      description: `Pedido ${order.id} → ${orderStatusLabels[nextStatus]}`,
    });
  };

  const handleCancel = () => {
    onUpdateStatus(order.id, "cancelado", statusNote || "Cancelado pelo administrador");
    setStatusNote("");
    toast({ title: "Pedido cancelado", description: order.id });
  };

  const handleAddNote = () => {
    if (!newNote.trim()) return;
    onAddNote(order.id, newNote.trim());
    setNewNote("");
    setShowNoteInput(false);
    toast({ title: "Observação adicionada" });
  };

  const handleSaveTracking = () => {
    if (!trackingInput.trim()) return;
    onUpdateTracking(order.id, trackingInput.trim());
    setTrackingInput("");
    toast({ title: "Rastreio atualizado" });
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({ title: "Copiado!" });
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-xl overflow-y-auto">
        <SheetHeader>
          <div className="flex items-center justify-between">
            <SheetTitle className="text-left">Pedido {order.id}</SheetTitle>
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => copyToClipboard(order.id)}
              >
                <Copy className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <Printer className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </SheetHeader>

        <div className="mt-6 space-y-6">
          {/* Status + Quick Actions */}
          <div className="rounded-xl border bg-muted/30 p-4 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Badge
                  variant="secondary"
                  className={`${orderStatusColors[order.status]} border-0 text-sm px-3 py-1`}
                >
                  {statusIcons[order.status]}
                  <span className="ml-1.5">{orderStatusLabels[order.status]}</span>
                </Badge>
              </div>
              <span className="text-sm text-muted-foreground">{fmtDate(order.date)}</span>
            </div>

            {/* Status progress bar */}
            {order.status !== "cancelado" && (
              <div className="flex gap-1">
                {statusFlow.map((s, i) => (
                  <div
                    key={s}
                    className={`h-1.5 flex-1 rounded-full transition-colors ${
                      i <= currentIdx
                        ? "bg-primary"
                        : "bg-muted-foreground/20"
                    }`}
                  />
                ))}
              </div>
            )}

            {/* Advance / Cancel */}
            <div className="space-y-2">
              <Textarea
                placeholder="Observação da mudança de status (opcional)..."
                value={statusNote}
                onChange={(e) => setStatusNote(e.target.value)}
                rows={2}
                className="text-sm"
              />
              <div className="flex gap-2">
                {nextStatus && (
                  <Button
                    className="flex-1 gradient-primary text-primary-foreground"
                    onClick={handleAdvance}
                  >
                    Avançar para: {orderStatusLabels[nextStatus]}
                  </Button>
                )}
                {canCancel && (
                  <Button
                    variant="outline"
                    className="text-destructive hover:text-destructive"
                    onClick={handleCancel}
                  >
                    Cancelar Pedido
                  </Button>
                )}
              </div>
            </div>
          </div>

          {/* Items */}
          <div>
            <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
              <Package className="h-4 w-4 text-primary" /> Itens do Pedido
            </h3>
            <div className="space-y-2">
              {order.items.map((item, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 p-2 rounded-lg bg-muted/30"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="h-12 w-12 rounded-lg object-cover"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{item.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {item.quantity}x {fmt(item.price)}
                    </p>
                  </div>
                  <p className="text-sm font-semibold">
                    {fmt(item.price * item.quantity)}
                  </p>
                </div>
              ))}
            </div>

            {/* Totals */}
            <div className="mt-3 space-y-1 text-sm border-t pt-3">
              <div className="flex justify-between text-muted-foreground">
                <span>Subtotal</span>
                <span>{fmt(order.subtotal)}</span>
              </div>
              {order.shipping > 0 && (
                <div className="flex justify-between text-muted-foreground">
                  <span>Frete</span>
                  <span>{fmt(order.shipping)}</span>
                </div>
              )}
              {order.discount > 0 && (
                <div className="flex justify-between text-success">
                  <span>Desconto</span>
                  <span>-{fmt(order.discount)}</span>
                </div>
              )}
              <div className="flex justify-between font-bold text-base pt-1">
                <span>Total</span>
                <span>{fmt(order.total)}</span>
              </div>
            </div>
          </div>

          <Separator />

          {/* Customer */}
          <div>
            <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
              <User className="h-4 w-4 text-primary" /> Cliente
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <User className="h-3.5 w-3.5 text-muted-foreground" />
                <span>{order.customer}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-3.5 w-3.5 text-muted-foreground" />
                <span className="text-muted-foreground">{order.email}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-3.5 w-3.5 text-muted-foreground" />
                <span className="text-muted-foreground">{order.phone}</span>
              </div>
            </div>
          </div>

          <Separator />

          {/* Address */}
          <div>
            <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
              <MapPin className="h-4 w-4 text-primary" /> Endereço de Entrega
            </h3>
            <div className="bg-muted/30 rounded-lg p-3 text-sm space-y-0.5">
              <p>
                {order.address.street}, {order.address.number}
                {order.address.complement && ` - ${order.address.complement}`}
              </p>
              <p>{order.address.neighborhood}</p>
              <p>
                {order.address.city} - {order.address.state}
              </p>
              <p className="font-mono text-xs text-muted-foreground">
                CEP: {order.address.zip}
              </p>
            </div>
          </div>

          <Separator />

          {/* Payment */}
          <div>
            <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
              <CreditCard className="h-4 w-4 text-primary" /> Pagamento
            </h3>
            <div className="flex items-center gap-3">
              <Badge
                variant="secondary"
                className={`border-0 text-xs ${
                  order.payment === "aprovado"
                    ? "bg-success/10 text-success"
                    : order.payment === "pendente"
                    ? "bg-warning/10 text-warning"
                    : "bg-destructive/10 text-destructive"
                }`}
              >
                {order.payment === "aprovado"
                  ? "Aprovado"
                  : order.payment === "pendente"
                  ? "Pendente"
                  : "Recusado"}
              </Badge>
              <span className="text-sm text-muted-foreground">
                {order.paymentMethod}
              </span>
            </div>
          </div>

          <Separator />

          {/* Tracking */}
          <div>
            <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
              <Truck className="h-4 w-4 text-primary" /> Rastreio
            </h3>
            {order.tracking ? (
              <div className="flex items-center gap-2">
                <code className="bg-muted rounded px-2 py-1 text-sm font-mono">
                  {order.tracking}
                </code>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7"
                  onClick={() => copyToClipboard(order.tracking!)}
                >
                  <Copy className="h-3.5 w-3.5" />
                </Button>
              </div>
            ) : (
              <div className="flex gap-2">
                <Input
                  placeholder="Código de rastreio..."
                  value={trackingInput}
                  onChange={(e) => setTrackingInput(e.target.value)}
                  className="flex-1 h-9"
                />
                <Button size="sm" onClick={handleSaveTracking}>
                  Salvar
                </Button>
              </div>
            )}
          </div>

          <Separator />

          {/* Timeline */}
          <div>
            <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
              <Clock className="h-4 w-4 text-primary" /> Histórico
            </h3>
            <div className="space-y-0">
              {[...order.timeline].reverse().map((event, i) => (
                <div key={i} className="flex gap-3 pb-4 last:pb-0">
                  <div className="flex flex-col items-center">
                    <div
                      className={`h-7 w-7 rounded-full flex items-center justify-center shrink-0 ${
                        i === 0
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {statusIcons[event.status]}
                    </div>
                    {i < order.timeline.length - 1 && (
                      <div className="w-px h-full bg-border mt-1" />
                    )}
                  </div>
                  <div className="pt-0.5">
                    <p className={`text-sm font-medium ${i === 0 ? "" : "text-muted-foreground"}`}>
                      {orderStatusLabels[event.status] || event.status}
                    </p>
                    {event.note && (
                      <p className="text-xs text-muted-foreground mt-0.5">{event.note}</p>
                    )}
                    <p className="text-xs text-muted-foreground/70 mt-0.5">
                      {fmtDate(event.date)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Notes */}
          {(order.notes || showNoteInput) && (
            <>
              <Separator />
              <div>
                <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
                  <MessageSquare className="h-4 w-4 text-primary" /> Observações
                </h3>
                {order.notes && (
                  <p className="text-sm bg-warning/5 border border-warning/20 rounded-lg p-3 mb-3">
                    <AlertCircle className="h-3.5 w-3.5 inline mr-1.5 text-warning" />
                    {order.notes}
                  </p>
                )}
                {showNoteInput && (
                  <div className="space-y-2">
                    <Textarea
                      value={newNote}
                      onChange={(e) => setNewNote(e.target.value)}
                      placeholder="Adicionar observação..."
                      rows={2}
                    />
                    <div className="flex gap-2 justify-end">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setShowNoteInput(false)}
                      >
                        Cancelar
                      </Button>
                      <Button size="sm" onClick={handleAddNote}>
                        Salvar
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </>
          )}

          {!showNoteInput && (
            <Button
              variant="outline"
              className="w-full"
              onClick={() => setShowNoteInput(true)}
            >
              <MessageSquare className="h-4 w-4 mr-2" /> Adicionar Observação
            </Button>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
