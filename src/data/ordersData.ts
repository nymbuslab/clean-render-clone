import { mockProducts } from "@/data/mockData";

// Enriched order type with full details
export interface OrderItem {
  productId: string;
  name: string;
  image: string;
  price: number;
  quantity: number;
}

export interface OrderEvent {
  status: string;
  date: string;
  note?: string;
}

export interface Order {
  id: string;
  customer: string;
  email: string;
  phone: string;
  date: string;
  total: number;
  subtotal: number;
  shipping: number;
  discount: number;
  status: string;
  payment: string;
  paymentMethod: string;
  items: OrderItem[];
  address: {
    street: string;
    number: string;
    complement?: string;
    neighborhood: string;
    city: string;
    state: string;
    zip: string;
  };
  tracking?: string;
  notes?: string;
  timeline: OrderEvent[];
}

const pick = (arr: typeof mockProducts, count: number): OrderItem[] => {
  const shuffled = [...arr].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count).map((p) => ({
    productId: p.id,
    name: p.name,
    image: p.image,
    price: p.price,
    quantity: Math.floor(Math.random() * 3) + 1,
  }));
};

const addr = (i: number) => ({
  street: ["Rua das Flores", "Av. Paulista", "Rua XV de Novembro", "Av. Brasil", "Rua Augusta", "Rua Oscar Freire", "Av. Atlântica", "Rua Bela Cintra"][i],
  number: String(100 + i * 47),
  complement: i % 3 === 0 ? `Apto ${i + 1}0${i + 2}` : undefined,
  neighborhood: ["Centro", "Bela Vista", "Jardins", "Copacabana", "Pinheiros", "Vila Mariana", "Ipanema", "Moema"][i],
  city: "São Paulo",
  state: "SP",
  zip: `0${i + 1}000-${String(i * 111).padStart(3, "0")}`,
});

export const enrichedOrders: Order[] = [
  {
    id: "#1001", customer: "Maria Silva", email: "maria@email.com", phone: "(11) 99123-4567",
    date: "2024-03-15T14:23:00", total: 259.80, subtotal: 259.80, shipping: 0, discount: 0,
    status: "entregue", payment: "aprovado", paymentMethod: "Cartão de Crédito (3x)",
    items: pick(mockProducts, 3), address: addr(0), tracking: "BR123456789XX",
    timeline: [
      { status: "aguardando_pagamento", date: "2024-03-15T14:23:00" },
      { status: "pago", date: "2024-03-15T14:25:00", note: "Pagamento confirmado pela operadora" },
      { status: "em_separacao", date: "2024-03-15T15:10:00" },
      { status: "pronto_entrega", date: "2024-03-15T17:30:00" },
      { status: "saiu_entrega", date: "2024-03-16T08:00:00", note: "Entregue à transportadora" },
      { status: "entregue", date: "2024-03-17T10:45:00", note: "Recebido por Maria" },
    ],
  },
  {
    id: "#1002", customer: "João Santos", email: "joao@email.com", phone: "(11) 98765-4321",
    date: "2024-03-15T16:45:00", total: 149.90, subtotal: 149.90, shipping: 15.00, discount: 15.00,
    status: "em_separacao", payment: "aprovado", paymentMethod: "Pix",
    items: pick(mockProducts, 1), address: addr(1),
    timeline: [
      { status: "aguardando_pagamento", date: "2024-03-15T16:45:00" },
      { status: "pago", date: "2024-03-15T16:46:00", note: "Pix confirmado" },
      { status: "em_separacao", date: "2024-03-15T18:00:00" },
    ],
  },
  {
    id: "#1003", customer: "Ana Costa", email: "ana@email.com", phone: "(21) 97654-3210",
    date: "2024-03-14T09:12:00", total: 439.70, subtotal: 479.70, shipping: 0, discount: 40.00,
    status: "pago", payment: "aprovado", paymentMethod: "Cartão de Crédito (6x)",
    items: pick(mockProducts, 4), address: addr(2),
    notes: "Presente para aniversário. Embrulhar para presente.",
    timeline: [
      { status: "aguardando_pagamento", date: "2024-03-14T09:12:00" },
      { status: "pago", date: "2024-03-14T09:15:00", note: "Pagamento aprovado" },
    ],
  },
  {
    id: "#1004", customer: "Carlos Oliveira", email: "carlos@email.com", phone: "(11) 96543-2109",
    date: "2024-03-14T11:30:00", total: 89.90, subtotal: 89.90, shipping: 12.00, discount: 0,
    status: "aguardando_pagamento", payment: "pendente", paymentMethod: "Boleto Bancário",
    items: pick(mockProducts, 1), address: addr(3),
    timeline: [
      { status: "aguardando_pagamento", date: "2024-03-14T11:30:00", note: "Boleto gerado - vencimento 17/03" },
    ],
  },
  {
    id: "#1005", customer: "Fernanda Lima", email: "fernanda@email.com", phone: "(11) 95432-1098",
    date: "2024-03-13T15:00:00", total: 329.80, subtotal: 329.80, shipping: 0, discount: 0,
    status: "saiu_entrega", payment: "aprovado", paymentMethod: "Cartão de Crédito (2x)",
    items: pick(mockProducts, 2), address: addr(4), tracking: "BR987654321XX",
    timeline: [
      { status: "aguardando_pagamento", date: "2024-03-13T15:00:00" },
      { status: "pago", date: "2024-03-13T15:02:00" },
      { status: "em_separacao", date: "2024-03-13T16:30:00" },
      { status: "pronto_entrega", date: "2024-03-14T09:00:00" },
      { status: "saiu_entrega", date: "2024-03-14T14:00:00", note: "Transportadora: Correios SEDEX" },
    ],
  },
  {
    id: "#1006", customer: "Pedro Almeida", email: "pedro@email.com", phone: "(11) 94321-0987",
    date: "2024-03-13T18:20:00", total: 59.90, subtotal: 59.90, shipping: 9.90, discount: 0,
    status: "cancelado", payment: "recusado", paymentMethod: "Cartão de Crédito",
    items: pick(mockProducts, 1), address: addr(5),
    notes: "Cartão recusado pela operadora. Cliente não respondeu contato.",
    timeline: [
      { status: "aguardando_pagamento", date: "2024-03-13T18:20:00" },
      { status: "cancelado", date: "2024-03-14T18:20:00", note: "Pagamento não confirmado após 24h" },
    ],
  },
  {
    id: "#1007", customer: "Lucia Ferreira", email: "lucia@email.com", phone: "(21) 93210-9876",
    date: "2024-03-12T10:05:00", total: 189.90, subtotal: 189.90, shipping: 0, discount: 0,
    status: "pronto_entrega", payment: "aprovado", paymentMethod: "Pix",
    items: pick(mockProducts, 1), address: addr(6),
    timeline: [
      { status: "aguardando_pagamento", date: "2024-03-12T10:05:00" },
      { status: "pago", date: "2024-03-12T10:06:00", note: "Pix confirmado" },
      { status: "em_separacao", date: "2024-03-12T11:00:00" },
      { status: "pronto_entrega", date: "2024-03-12T16:00:00", note: "Aguardando coleta da transportadora" },
    ],
  },
  {
    id: "#1008", customer: "Roberto Dias", email: "roberto@email.com", phone: "(11) 92109-8765",
    date: "2024-03-12T08:15:00", total: 519.60, subtotal: 559.60, shipping: 0, discount: 40.00,
    status: "entregue", payment: "aprovado", paymentMethod: "Cartão de Crédito (10x)",
    items: pick(mockProducts, 5), address: addr(7), tracking: "BR456789123XX",
    timeline: [
      { status: "aguardando_pagamento", date: "2024-03-12T08:15:00" },
      { status: "pago", date: "2024-03-12T08:18:00" },
      { status: "em_separacao", date: "2024-03-12T09:30:00" },
      { status: "pronto_entrega", date: "2024-03-12T14:00:00" },
      { status: "saiu_entrega", date: "2024-03-13T07:30:00" },
      { status: "entregue", date: "2024-03-14T11:20:00", note: "Recebido por porteiro" },
    ],
  },
];
