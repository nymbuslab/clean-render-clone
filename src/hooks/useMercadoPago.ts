declare global {
  interface Window {
    MercadoPago: new (publicKey: string, options?: { locale: string }) => MercadoPagoInstance;
  }
}

interface MercadoPagoInstance {
  createCardToken(data: CardTokenData): Promise<{ id: string }>;
  getInstallments(data: { amount: string; bin: string }): Promise<InstallmentResult[]>;
  getPaymentMethods(data: { bin: string }): Promise<{ results: PaymentMethodResult[] }>;
}

interface CardTokenData {
  cardNumber: string;
  cardholderName: string;
  cardExpirationMonth: string;
  cardExpirationYear: string;
  securityCode: string;
  identificationType: string;
  identificationNumber: string;
}

interface InstallmentResult {
  payment_method_id: string;
  issuer: { id: string; name: string };
  payer_costs: { installments: number; recommended_message: string }[];
}

interface PaymentMethodResult {
  id: string;
  name: string;
  payment_type_id: string;
  thumbnail: string;
}

export interface CardData {
  cardNumber: string;
  cardholderName: string;
  expirationMonth: string;
  expirationYear: string;
  securityCode: string;
}

const MP_PUBLIC_KEY = "APP_USR-f6e7ef0b-194b-48f9-bf57-1977e90b000a";

let mpInstance: MercadoPagoInstance | null = null;

function getMp(): MercadoPagoInstance {
  if (!mpInstance) {
    if (!window.MercadoPago) throw new Error("MercadoPago SDK not loaded");
    mpInstance = new window.MercadoPago(MP_PUBLIC_KEY, { locale: "pt-BR" });
  }
  return mpInstance;
}

export async function createCardToken(
  card: CardData,
  identification: { type: string; number: string }
): Promise<string> {
  const mp = getMp();
  const result = await mp.createCardToken({
    cardNumber: card.cardNumber.replace(/\s/g, ""),
    cardholderName: card.cardholderName,
    cardExpirationMonth: card.expirationMonth,
    cardExpirationYear: card.expirationYear,
    securityCode: card.securityCode,
    identificationType: identification.type,
    identificationNumber: identification.number,
  });
  return result.id;
}

export async function getInstallments(amount: number, bin: string) {
  const mp = getMp();
  const results = await mp.getInstallments({ amount: String(amount), bin });
  return results;
}

export async function getPaymentMethods(bin: string) {
  const mp = getMp();
  const results = await mp.getPaymentMethods({ bin });
  return results.results;
}
