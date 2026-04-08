import { Lock } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { mockProducts } from "@/data/mockData";
import { supabase } from "@/integrations/supabase/client";
import CheckoutProgressSteps from "@/components/checkout/CheckoutProgressSteps";
import PersonalInfoSection from "@/components/checkout/PersonalInfoSection";
import AddressSection from "@/components/checkout/AddressSection";
import ShippingSection from "@/components/checkout/ShippingSection";
import PaymentSection from "@/components/checkout/PaymentSection";
import OrderSummary from "@/components/checkout/OrderSummary";
import PixQrCodeDialog from "@/components/checkout/PixQrCodeDialog";

const cartItems = [
  { ...mockProducts[0], qty: 2 },
  { ...mockProducts[2], qty: 1 },
  { ...mockProducts[4], qty: 1 },
];

export default function CheckoutPage() {
  const fmt = (v: number) => v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
  const subtotal = cartItems.reduce((s, i) => s + i.price * i.qty, 0);
  const shipping = 8;
  const discount = 0;
  const total = subtotal + shipping - discount;

  const [payMethod, setPayMethod] = useState("pix");
  const [coupon, setCoupon] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [pixDialogOpen, setPixDialogOpen] = useState(false);
  const [pixData, setPixData] = useState<{ qr_code: string; qr_code_base64: string; ticket_url?: string } | null>(null);
  const [payer, setPayer] = useState({ name: "", email: "", cpf: "", phone: "" });

  const handleSubmit = async () => {
    if (!payer.name || !payer.email || !payer.cpf) {
      toast.error("Preencha todos os dados pessoais (nome, e-mail e CPF).");
      return;
    }

    setIsProcessing(true);

    try {
      const names = payer.name.split(" ");
      const firstName = names[0];
      const lastName = names.slice(1).join(" ") || firstName;
      const cpfClean = payer.cpf.replace(/\D/g, "");

      const paymentAmount = payMethod === "pix" ? +(total * 0.95).toFixed(2) : total;

      const payload: Record<string, unknown> = {
        payment_method: payMethod,
        transaction_amount: paymentAmount,
        payer: {
          email: payer.email,
          first_name: firstName,
          last_name: lastName,
          identification: { type: "CPF", number: cpfClean },
        },
        items: cartItems.map(i => ({ name: i.name, quantity: i.qty, unit_price: i.price })),
      };

      const { data, error } = await supabase.functions.invoke("mercadopago-payment", {
        body: payload,
      });

      if (error) throw error;

      if (payMethod === "pix" && data?.pix) {
        setPixData(data.pix);
        setPixDialogOpen(true);
        toast.success("QR Code Pix gerado! Escaneie para pagar.");
      } else if (payMethod === "credit_card") {
        if (data?.status === "approved") {
          toast.success("Pagamento aprovado com sucesso!");
        } else {
          toast.info(`Status do pagamento: ${data?.status_detail || data?.status}`);
        }
      }
    } catch (err) {
      console.error("Payment error:", err);
      toast.error("Erro ao processar pagamento. Tente novamente.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <CheckoutProgressSteps currentStep={2} />

      <div className="flex items-center gap-2 mb-6">
        <Lock className="h-5 w-5 text-success" />
        <h1 className="text-2xl font-bold">Checkout Seguro</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <PersonalInfoSection payer={payer} onChange={setPayer} />
          <AddressSection />
          <ShippingSection shipping={shipping} fmt={fmt} />
          <PaymentSection payMethod={payMethod} onPayMethodChange={setPayMethod} />
        </div>

        <OrderSummary
          cartItems={cartItems}
          subtotal={subtotal}
          shipping={shipping}
          discount={discount}
          total={total}
          payMethod={payMethod}
          coupon={coupon}
          onCouponChange={setCoupon}
          onSubmit={handleSubmit}
          isProcessing={isProcessing}
          fmt={fmt}
        />
      </div>

      <PixQrCodeDialog
        open={pixDialogOpen}
        onOpenChange={setPixDialogOpen}
        pixData={pixData}
        total={total}
        fmt={fmt}
      />
    </div>
  );
}
