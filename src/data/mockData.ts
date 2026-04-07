// Mock data for the entire prototype
import camisetaBasica from "@/assets/products/camiseta-basica.jpg";
import calcaJeans from "@/assets/products/calca-jeans.jpg";
import tenisCasual from "@/assets/products/tenis-casual.jpg";
import jaquetaCorta from "@/assets/products/jaqueta-corta-vento.jpg";
import boneTrucker from "@/assets/products/bone-trucker.jpg";
import mochilaUrban from "@/assets/products/mochila-urban.jpg";
import bermudaSarja from "@/assets/products/bermuda-sarja.jpg";
import poloEssential from "@/assets/products/polo-essential.jpg";

export const mockProducts = [
  { id: "1", name: "Camiseta Básica Algodão", price: 59.90, stock: 45, category: "Camisetas", status: "active", image: camisetaBasica },
  { id: "2", name: "Calça Jeans Slim", price: 149.90, stock: 23, category: "Calças", status: "active", image: calcaJeans },
  { id: "3", name: "Tênis Casual Urbano", price: 219.90, stock: 12, category: "Calçados", status: "active", image: tenisCasual },
  { id: "4", name: "Jaqueta Corta-Vento", price: 189.90, stock: 8, category: "Jaquetas", status: "active", image: jaquetaCorta },
  { id: "5", name: "Boné Trucker Classic", price: 49.90, stock: 67, category: "Acessórios", status: "active", image: boneTrucker },
  { id: "6", name: "Mochila Urban Pro", price: 129.90, stock: 0, category: "Acessórios", status: "inactive", image: mochilaUrban },
  { id: "7", name: "Bermuda Sarja Premium", price: 89.90, stock: 34, category: "Bermudas", status: "active", image: bermudaSarja },
  { id: "8", name: "Polo Fit Essential", price: 79.90, stock: 19, category: "Camisetas", status: "active", image: poloEssential },
];

export const mockOrders = [
  { id: "#1001", customer: "Maria Silva", date: "2024-03-15", total: 259.80, status: "entregue", payment: "aprovado", items: 3 },
  { id: "#1002", customer: "João Santos", date: "2024-03-15", total: 149.90, status: "em_separacao", payment: "aprovado", items: 1 },
  { id: "#1003", customer: "Ana Costa", date: "2024-03-14", total: 439.70, status: "pago", payment: "aprovado", items: 4 },
  { id: "#1004", customer: "Carlos Oliveira", date: "2024-03-14", total: 89.90, status: "aguardando_pagamento", payment: "pendente", items: 1 },
  { id: "#1005", customer: "Fernanda Lima", date: "2024-03-13", total: 329.80, status: "saiu_entrega", payment: "aprovado", items: 2 },
  { id: "#1006", customer: "Pedro Almeida", date: "2024-03-13", total: 59.90, status: "cancelado", payment: "recusado", items: 1 },
  { id: "#1007", customer: "Lucia Ferreira", date: "2024-03-12", total: 189.90, status: "pronto_entrega", payment: "aprovado", items: 1 },
  { id: "#1008", customer: "Roberto Dias", date: "2024-03-12", total: 519.60, status: "entregue", payment: "aprovado", items: 5 },
];

export const mockCustomers = [
  { id: "1", name: "Maria Silva", email: "maria@email.com", phone: "(11) 99123-4567", cpf: "123.456.789-00", orders: 8, totalSpent: 1250.40, lastOrder: "2024-03-15", status: "ativo", createdAt: "2023-06-10", address: { street: "Rua das Flores", number: "100", neighborhood: "Centro", city: "São Paulo", state: "SP", zip: "01000-000" } },
  { id: "2", name: "João Santos", email: "joao@email.com", phone: "(11) 98765-4321", cpf: "234.567.890-11", orders: 3, totalSpent: 489.70, lastOrder: "2024-03-15", status: "ativo", createdAt: "2023-09-22", address: { street: "Av. Paulista", number: "147", complement: "Sala 302", neighborhood: "Bela Vista", city: "São Paulo", state: "SP", zip: "02000-111" } },
  { id: "3", name: "Ana Costa", email: "ana@email.com", phone: "(21) 97654-3210", cpf: "345.678.901-22", orders: 12, totalSpent: 2340.80, lastOrder: "2024-03-14", status: "ativo", createdAt: "2023-01-15", address: { street: "Rua XV de Novembro", number: "194", neighborhood: "Jardins", city: "São Paulo", state: "SP", zip: "03000-222" } },
  { id: "4", name: "Carlos Oliveira", email: "carlos@email.com", phone: "(11) 96543-2109", orders: 1, totalSpent: 89.90, lastOrder: "2024-03-14", status: "novo", createdAt: "2024-03-14" },
  { id: "5", name: "Fernanda Lima", email: "fernanda@email.com", phone: "(11) 95432-1098", cpf: "567.890.123-44", orders: 5, totalSpent: 890.50, lastOrder: "2024-03-13", status: "ativo", createdAt: "2023-11-05", address: { street: "Rua Augusta", number: "288", neighborhood: "Pinheiros", city: "São Paulo", state: "SP", zip: "05000-444" } },
  { id: "6", name: "Pedro Almeida", email: "pedro@email.com", phone: "(11) 94321-0987", orders: 2, totalSpent: 159.80, lastOrder: "2024-03-13", status: "inativo", createdAt: "2023-04-20" },
  { id: "7", name: "Lucia Ferreira", email: "lucia@email.com", phone: "(21) 93210-9876", cpf: "789.012.345-66", orders: 4, totalSpent: 720.60, lastOrder: "2024-03-12", status: "ativo", createdAt: "2023-07-18", address: { street: "Av. Atlântica", number: "382", neighborhood: "Ipanema", city: "Rio de Janeiro", state: "RJ", zip: "07000-666" } },
  { id: "8", name: "Roberto Dias", email: "roberto@email.com", phone: "(11) 92109-8765", cpf: "890.123.456-77", orders: 6, totalSpent: 1580.40, lastOrder: "2024-03-12", status: "ativo", createdAt: "2023-02-28", address: { street: "Rua Bela Cintra", number: "429", complement: "Apto 1204", neighborhood: "Moema", city: "São Paulo", state: "SP", zip: "08000-777" } },
];

export const orderStatusLabels: Record<string, string> = {
  aguardando_pagamento: "Aguardando Pagamento",
  pago: "Pago",
  em_separacao: "Em Separação",
  pronto_entrega: "Pronto p/ Entrega",
  saiu_entrega: "Saiu p/ Entrega",
  entregue: "Entregue",
  cancelado: "Cancelado",
};

export const orderStatusColors: Record<string, string> = {
  aguardando_pagamento: "bg-warning/10 text-warning",
  pago: "bg-info/10 text-info",
  em_separacao: "bg-primary/10 text-primary",
  pronto_entrega: "bg-accent/10 text-accent",
  saiu_entrega: "bg-info/10 text-info",
  entregue: "bg-success/10 text-success",
  cancelado: "bg-destructive/10 text-destructive",
};

export const mockStats = {
  revenue: 15420.30,
  orders: 47,
  avgTicket: 328.09,
  customers: 32,
  revenueGrowth: 12.5,
  ordersGrowth: 8.3,
  ticketGrowth: -2.1,
  customersGrowth: 15.0,
};

export const mockRevenueChart = [
  { month: "Out", value: 8200 },
  { month: "Nov", value: 11500 },
  { month: "Dez", value: 14800 },
  { month: "Jan", value: 12300 },
  { month: "Fev", value: 13100 },
  { month: "Mar", value: 15420 },
];

export const mockTopProducts = [
  { name: "Camiseta Básica Algodão", sold: 34, revenue: 2036.60 },
  { name: "Calça Jeans Slim", sold: 21, revenue: 3147.90 },
  { name: "Tênis Casual Urbano", sold: 15, revenue: 3298.50 },
  { name: "Bermuda Sarja Premium", sold: 12, revenue: 1078.80 },
  { name: "Polo Fit Essential", sold: 10, revenue: 799.00 },
];
