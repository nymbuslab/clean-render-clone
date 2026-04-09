import { Lock } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { mockProducts } from "@/data/mockData";
import { supabase } from "@/integrations/supabase/client";
import { createCardToken, getInstallments, getPaymentMethods, CardData } from "@/hooks/useMercadoPago";
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
  const navigate = useNavigate();
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

  const [cardData, setCardData] = useState<CardData>({
    cardNumber: "",
    cardholderName: "",
    expirationMonth: "",
    expirationYear: "",
    securityCode: "",
  });
  const [installments, setInstallments] = useState(1);
  const [installmentOptions, setInstallmentOptions] = useState<{ installments: number; recommended_message: string }[]>([]);
  const [paymentMethodId, setPaymentMethodId] = useState("");
  const [issuerId, setIssuerId] = useState("");

  // Fetch installments when card BIN changes (first 6 digits)
  const bin = cardData.cardNumber.replace(/\s/g, "").slice(0, 6);
  useEffect(() => {
    if (bin.length < 6 || payMethod !== "credit_card") {
      setInstallmentOptions([]);
      setPaymentMethodId("");
      setIssuerId("");
      return;
    }

    let cancelled = false;

    (async () => {
      try {
        const [installRes, methodRes] = await Promise.all([
          getInstallments(total, bin),
          getPaymentMethods(bin),
        ]);

        if (cancelled) return;

        if (methodRes.length > 0) {
          setPaymentMethodId(methodRes[0].id);
        }

        if (installRes.length > 0) {
          setIssuerId(String(installRes[0].issuer.id));
          setInstallmentOptions(installRes[0].payer_costs);
        }
      } catch (err) {
        console.error("Error fetching card info:", err);
      }
    })();

    return () => { cancelled = true; };
  }, [bin, total, payMethod]);

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
        order_data: { subtotal, shipping, discount },
      };

      // For credit card, tokenize with MercadoPago.js SDK
      if (payMethod === "credit_card") {
        if (!cardData.cardNumber || !cardData.expirationMonth || !cardData.expirationYear || !cardData.securityCode || !cardData.cardholderName) {
          toast.error("Preencha todos os dados do cartão.");
          setIsProcessing(false);
          return;
        }

        try {
          const token = await createCardToken(cardData, { type: "CPF", number: cpfClean });
          payload.token = token;
          payload.installments = installments;
          payload.payment_method_id = paymentMethodId;
          payload.issuer_id = issuerId;
        } catch (tokenErr) {
          console.error("Card tokenization error:", tokenErr);
          toast.error("Erro ao processar dados do cartão. Verifique as informações.");
          setIsProcessing(false);
          return;
        }
      }

      const { data, error } = await supabase.functions.invoke("mercadopago-payment", {
        body: payload,
      });

      if (error) throw error;

      if (payMethod === "pix" && data?.pix) {
        setPixData(data.pix);
        setPixDialogOpen(true);
        toast.success("QR Code Pix gerado! Escaneie para pagar.");
        // Navigate to confirmation after closing dialog
        setTimeout(() => {
          navigate(`/loja/confirmacao?pedido=${data.order_id}`);
        }, 500);
      } else if (payMethod === "credit_card") {
        if (data?.status === "approved") {
          toast.success("Pagamento aprovado com sucesso!");
        } else {
          toast.info(`Status do pagamento: ${data?.status_detail || data?.status}`);
        }
        navigate(`/loja/confirmacao?pedido=${data.order_id}`);
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
          <PaymentSection
            payMethod={payMethod}
            onPayMethodChange={setPayMethod}
            cardData={cardData}
            onCardDataChange={setCardData}
            installments={installments}
            onInstallmentsChange={setInstallments}
            installmentOptions={installmentOptions}
          />
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
