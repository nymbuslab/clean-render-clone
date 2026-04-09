import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { CheckCircle2, Clock, XCircle, AlertTriangle, Package, ArrowLeft, Copy, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import CheckoutProgressSteps from "@/components/checkout/CheckoutProgressSteps";

interface OrderData {
  id: string;
  status: string;
  payment_method: string;
  payment_status: string;
  payment_status_detail: string;
  total: number;
  subtotal: number;
  shipping: number;
  discount: number;
  items: { name: string; quantity: number; unit_price: number }[];
  payer: { email: string; first_name: string; last_name: string };
  pix_data?: { qr_code?: string; qr_code_base64?: string; ticket_url?: string };
  created_at: string;
}

const statusConfig: Record<string, { icon: React.ReactNode; label: string; color: string; description: string }> = {
  approved: {
    icon: <CheckCircle2 className="h-12 w-12 text-success" />,
    label: "Pagamento Aprovado",
    color: "bg-success/10 text-success",
    description: "Seu pagamento foi confirmado! Estamos preparando seu pedido.",
  },
  pending: {
    icon: <Clock className="h-12 w-12 text-warning" />,
    label: "Aguardando Pagamento",
    color: "bg-warning/10 text-warning",
    description: "Estamos aguardando a confirmação do seu pagamento.",
  },
  processing: {
    icon: <Clock className="h-12 w-12 text-primary" />,
    label: "Processando",
    color: "bg-primary/10 text-primary",
    description: "Seu pagamento está sendo processado.",
  },
  rejected: {
    icon: <XCircle className="h-12 w-12 text-destructive" />,
    label: "Pagamento Rejeitado",
    color: "bg-destructive/10 text-destructive",
    description: "Infelizmente seu pagamento foi rejeitado. Tente novamente com outro método.",
  },
  failed: {
    icon: <AlertTriangle className="h-12 w-12 text-destructive" />,
    label: "Falha no Pagamento",
    color: "bg-destructive/10 text-destructive",
    description: "Houve um erro ao processar seu pagamento. Tente novamente.",
  },
};

const defaultStatus = {
  icon: <Clock className="h-12 w-12 text-muted-foreground" />,
  label: "Status Desconhecido",
  color: "bg-muted text-muted-foreground",
  description: "Verificando o status do seu pedido...",
};

export default function OrderConfirmationPage() {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get("pedido");
  const [order, setOrder] = useState<OrderData | null>(null);
  const [loading, setLoading] = useState(true);

  const fmt = (v: number) =>
    Number(v).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

  useEffect(() => {
    if (!orderId) {
      setLoading(false);
      return;
    }

    const fetchOrder = async () => {
      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .eq("id", orderId)
        .single();

      if (!error && data) {
        setOrder(data as unknown as OrderData);
      }
      setLoading(false);
    };

    fetchOrder();

    // Subscribe to realtime updates
    const channel = supabase
      .channel(`order-${orderId}`)
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "orders", filter: `id=eq.${orderId}` },
        (payload) => {
          setOrder(payload.new as unknown as OrderData);
          if (payload.new.status === "approved") {
            toast.success("Pagamento confirmado!");
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [orderId]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <CheckoutProgressSteps currentStep={3} />
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Carregando pedido...</p>
        </div>
      </div>
    );
  }

  if (!orderId || !order) {
    return (
      <div className="container mx-auto px-4 py-8">
        <CheckoutProgressSteps currentStep={3} />
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <AlertTriangle className="h-12 w-12 text-muted-foreground" />
          <h2 className="text-xl font-semibold">Pedido não encontrado</h2>
          <p className="text-muted-foreground">Verifique o link ou faça um novo pedido.</p>
          <Button asChild>
            <Link to="/loja">Voltar para a Loja</Link>
          </Button>
        </div>
      </div>
    );
  }

  const config = statusConfig[order.status] || defaultStatus;
  const paymentAmount =
    order.payment_method === "pix"
      ? Number(order.total) * 0.95
      : Number(order.total);

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <CheckoutProgressSteps currentStep={3} />

      {/* Status Hero */}
      <div className="text-center space-y-4 mb-8">
        <div className="flex justify-center">{config.icon}</div>
        <h1 className="text-2xl font-bold">{config.label}</h1>
        <p className="text-muted-foreground">{config.description}</p>
        <Badge className={`${config.color} border-0 text-sm px-3 py-1`}>
          {order.payment_method === "pix" ? "Pix" : "Cartão de Crédito"}
        </Badge>
      </div>

      {/* Order ID */}
      <div className="rounded-xl border bg-card p-6 mb-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">Número do pedido</p>
            <p className="font-mono text-sm font-medium">{order.id.slice(0, 8).toUpperCase()}</p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              navigator.clipboard.writeText(order.id);
              toast.success("ID copiado!");
            }}
          >
            <Copy className="h-4 w-4 mr-1" /> Copiar
          </Button>
        </div>
        <Separator className="my-4" />
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-muted-foreground">Data</p>
            <p className="font-medium">
              {new Date(order.created_at).toLocaleDateString("pt-BR", {
                day: "2-digit",
                month: "long",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
          </div>
          <div>
            <p className="text-muted-foreground">Status do pagamento</p>
            <p className="font-medium capitalize">{order.payment_status || order.status}</p>
          </div>
        </div>
      </div>

      {/* Pix pending: show QR code again */}
      {order.payment_method === "pix" && order.status === "pending" && order.pix_data?.qr_code && (
        <div className="rounded-xl border bg-card p-6 mb-6 text-center space-y-4">
          <h3 className="font-semibold">Escaneie o QR Code para pagar</h3>
          {order.pix_data.qr_code_base64 && (
            <img
              src={`data:image/png;base64,${order.pix_data.qr_code_base64}`}
              alt="QR Code Pix"
              className="mx-auto w-48 h-48"
            />
          )}
          <div className="space-y-2">
            <p className="text-xs text-muted-foreground">Ou copie o código Pix:</p>
            <div className="flex gap-2 max-w-md mx-auto">
              <code className="flex-1 bg-muted rounded p-2 text-xs break-all text-left">
                {order.pix_data.qr_code.slice(0, 60)}...
              </code>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  navigator.clipboard.writeText(order.pix_data!.qr_code!);
                  toast.success("Código Pix copiado!");
                }}
              >
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <p className="text-sm text-muted-foreground">
            O status será atualizado automaticamente após o pagamento.
          </p>
        </div>
      )}

      {/* Items */}
      <div className="rounded-xl border bg-card p-6 mb-6">
        <h3 className="font-semibold mb-4 flex items-center gap-2">
          <Package className="h-5 w-5" /> Itens do Pedido
        </h3>
        <div className="space-y-3">
          {(order.items as { name: string; quantity: number; unit_price: number }[]).map(
            (item, idx) => (
              <div key={idx} className="flex justify-between text-sm">
                <span>
                  {item.name} <span className="text-muted-foreground">x{item.quantity}</span>
                </span>
                <span className="font-medium">{fmt(item.unit_price * item.quantity)}</span>
              </div>
            )
          )}
        </div>
        <Separator className="my-4" />
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Subtotal</span>
            <span>{fmt(Number(order.subtotal))}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Frete</span>
            <span>{fmt(Number(order.shipping))}</span>
          </div>
          {order.payment_method === "pix" && (
            <div className="flex justify-between text-success">
              <span>Desconto Pix (5%)</span>
              <span>-{fmt(Number(order.total) * 0.05)}</span>
            </div>
          )}
          <Separator />
          <div className="flex justify-between font-semibold text-base">
            <span>Total</span>
            <span>{fmt(paymentAmount)}</span>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Button asChild variant="outline">
          <Link to="/loja">
            <ArrowLeft className="h-4 w-4 mr-2" /> Continuar Comprando
          </Link>
        </Button>
      </div>
    </div>
  );
}
