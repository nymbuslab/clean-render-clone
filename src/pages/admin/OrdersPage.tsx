import { useState, useMemo } from "react";
import {
  Search,
  Filter,
  Eye,
  ArrowUpDown,
  ShoppingBag,
  Clock,
  CheckCircle2,
  Truck,
  XCircle,
  DollarSign,
  TrendingUp,
  Package,
} from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { orderStatusLabels, orderStatusColors } from "@/data/mockData";
import { enrichedOrders, type Order } from "@/data/ordersData";
import OrderDetailsSheet from "@/components/admin/OrderDetailsSheet";

type SortKey = "date" | "total" | "customer";
type SortDir = "asc" | "desc";

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>(enrichedOrders);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [paymentFilter, setPaymentFilter] = useState("all");
  const [sortKey, setSortKey] = useState<SortKey>("date");
  const [sortDir, setSortDir] = useState<SortDir>("desc");

  // Details sheet
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const fmt = (v: number) =>
    v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

  // Filter & sort
  const filtered = useMemo(() => {
    let list = [...orders];
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(
        (o) =>
          o.id.toLowerCase().includes(q) ||
          o.customer.toLowerCase().includes(q) ||
          o.email.toLowerCase().includes(q)
      );
    }
    if (statusFilter !== "all") list = list.filter((o) => o.status === statusFilter);
    if (paymentFilter !== "all") list = list.filter((o) => o.payment === paymentFilter);

    list.sort((a, b) => {
      const mul = sortDir === "asc" ? 1 : -1;
      if (sortKey === "date") return (new Date(a.date).getTime() - new Date(b.date).getTime()) * mul;
      if (sortKey === "total") return (a.total - b.total) * mul;
      return a.customer.localeCompare(b.customer) * mul;
    });

    return list;
  }, [orders, search, statusFilter, paymentFilter, sortKey, sortDir]);

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else { setSortKey(key); setSortDir("desc"); }
  };

  const openDetails = (o: Order) => {
    setSelectedOrder(o);
    setDetailsOpen(true);
  };

  // Handlers
  const handleUpdateStatus = (orderId: string, newStatus: string, note?: string) => {
    setOrders((prev) =>
      prev.map((o) => {
        if (o.id !== orderId) return o;
        return {
          ...o,
          status: newStatus,
          payment: newStatus === "cancelado" ? "recusado" : newStatus !== "aguardando_pagamento" ? "aprovado" : o.payment,
          timeline: [
            ...o.timeline,
            { status: newStatus, date: new Date().toISOString(), note },
          ],
        };
      })
    );
    // Update selectedOrder too
    setSelectedOrder((prev) => {
      if (!prev || prev.id !== orderId) return prev;
      return {
        ...prev,
        status: newStatus,
        payment: newStatus === "cancelado" ? "recusado" : newStatus !== "aguardando_pagamento" ? "aprovado" : prev.payment,
        timeline: [
          ...prev.timeline,
          { status: newStatus, date: new Date().toISOString(), note },
        ],
      };
    });
  };

  const handleAddNote = (orderId: string, note: string) => {
    setOrders((prev) =>
      prev.map((o) =>
        o.id === orderId
          ? { ...o, notes: o.notes ? `${o.notes}\n${note}` : note }
          : o
      )
    );
    setSelectedOrder((prev) =>
      prev && prev.id === orderId
        ? { ...prev, notes: prev.notes ? `${prev.notes}\n${note}` : note }
        : prev
    );
  };

  const handleUpdateTracking = (orderId: string, tracking: string) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, tracking } : o))
    );
    setSelectedOrder((prev) =>
      prev && prev.id === orderId ? { ...prev, tracking } : prev
    );
  };

  // Stats
  const totalRevenue = orders
    .filter((o) => o.payment === "aprovado")
    .reduce((a, o) => a + o.total, 0);
  const pendingOrders = orders.filter(
    (o) => !["entregue", "cancelado"].includes(o.status)
  ).length;
  const avgTicket = totalRevenue / (orders.filter((o) => o.payment === "aprovado").length || 1);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">Pedidos</h1>
        <p className="text-muted-foreground text-sm">
          {orders.length} pedidos encontrados
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        {[
          {
            label: "Receita Total",
            value: fmt(totalRevenue),
            icon: DollarSign,
            iconClass: "text-success",
          },
          {
            label: "Pedidos Pendentes",
            value: pendingOrders,
            icon: Clock,
            iconClass: "text-warning",
          },
          {
            label: "Ticket Médio",
            value: fmt(avgTicket),
            icon: TrendingUp,
            iconClass: "text-primary",
          },
          {
            label: "Total de Pedidos",
            value: orders.length,
            icon: ShoppingBag,
            iconClass: "text-info",
          },
        ].map((stat, i) => (
          <Card key={i} className="shadow-card">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                  <p className="text-xl font-bold mt-1">{stat.value}</p>
                </div>
                <stat.icon className={`h-5 w-5 ${stat.iconClass}`} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Status summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
        {Object.entries(orderStatusLabels).map(([key, label]) => {
          const count = orders.filter((o) => o.status === key).length;
          const isActive = statusFilter === key;
          return (
            <button
              key={key}
              onClick={() => setStatusFilter(isActive ? "all" : key)}
              className={`rounded-lg border p-3 text-left transition-all ${
                isActive
                  ? "border-primary bg-primary/5 shadow-card"
                  : "bg-card hover:shadow-card"
              }`}
            >
              <p className="text-lg font-bold">{count}</p>
              <p className="text-xs text-muted-foreground truncate">{label}</p>
            </button>
          );
        })}
      </div>

      {/* Table */}
      <Card className="shadow-card">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-3 flex-wrap">
            <div className="relative flex-1 min-w-[200px] max-w-sm">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar pedido, cliente, email..."
                className="pl-9 h-9"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <Select value={paymentFilter} onValueChange={setPaymentFilter}>
              <SelectTrigger className="w-[150px] h-9">
                <SelectValue placeholder="Pagamento" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos pagamentos</SelectItem>
                <SelectItem value="aprovado">Aprovado</SelectItem>
                <SelectItem value="pendente">Pendente</SelectItem>
                <SelectItem value="recusado">Recusado</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          {filtered.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <ShoppingBag className="h-12 w-12 mx-auto mb-3 opacity-30" />
              <p className="font-medium">Nenhum pedido encontrado</p>
              <p className="text-sm mt-1">Tente ajustar os filtros de busca.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-muted-foreground">
                    <th className="text-left py-2 font-medium">Pedido</th>
                    <th className="text-left py-2 font-medium">
                      <button
                        onClick={() => toggleSort("customer")}
                        className="flex items-center gap-1 hover:text-foreground transition-colors"
                      >
                        Cliente <ArrowUpDown className="h-3 w-3" />
                      </button>
                    </th>
                    <th className="text-left py-2 font-medium">
                      <button
                        onClick={() => toggleSort("date")}
                        className="flex items-center gap-1 hover:text-foreground transition-colors"
                      >
                        Data <ArrowUpDown className="h-3 w-3" />
                      </button>
                    </th>
                    <th className="text-center py-2 font-medium">Itens</th>
                    <th className="text-left py-2 font-medium">Status</th>
                    <th className="text-left py-2 font-medium">Pagamento</th>
                    <th className="text-right py-2 font-medium">
                      <button
                        onClick={() => toggleSort("total")}
                        className="flex items-center gap-1 ml-auto hover:text-foreground transition-colors"
                      >
                        Total <ArrowUpDown className="h-3 w-3" />
                      </button>
                    </th>
                    <th className="py-2 w-10"></th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((o) => (
                    <tr
                      key={o.id}
                      className="border-b last:border-0 hover:bg-muted/50 transition-colors cursor-pointer"
                      onClick={() => openDetails(o)}
                    >
                      <td className="py-3 font-medium font-mono text-xs">{o.id}</td>
                      <td className="py-3">
                        <div>
                          <span className="font-medium">{o.customer}</span>
                          <p className="text-xs text-muted-foreground">{o.email}</p>
                        </div>
                      </td>
                      <td className="py-3 text-muted-foreground">
                        {new Date(o.date).toLocaleDateString("pt-BR")}
                      </td>
                      <td className="py-3 text-center">{o.items.length}</td>
                      <td className="py-3">
                        <Badge
                          variant="secondary"
                          className={`${orderStatusColors[o.status]} border-0 text-xs`}
                        >
                          {orderStatusLabels[o.status]}
                        </Badge>
                      </td>
                      <td className="py-3">
                        <Badge
                          variant="secondary"
                          className={`border-0 text-xs ${
                            o.payment === "aprovado"
                              ? "bg-success/10 text-success"
                              : o.payment === "pendente"
                              ? "bg-warning/10 text-warning"
                              : "bg-destructive/10 text-destructive"
                          }`}
                        >
                          {o.payment === "aprovado"
                            ? "Aprovado"
                            : o.payment === "pendente"
                            ? "Pendente"
                            : "Recusado"}
                        </Badge>
                      </td>
                      <td className="py-3 text-right font-medium">{fmt(o.total)}</td>
                      <td className="py-3">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={(e) => {
                            e.stopPropagation();
                            openDetails(o);
                          }}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Order Details Sheet */}
      <OrderDetailsSheet
        open={detailsOpen}
        onOpenChange={setDetailsOpen}
        order={selectedOrder}
        onUpdateStatus={handleUpdateStatus}
        onAddNote={handleAddNote}
        onUpdateTracking={handleUpdateTracking}
      />
    </div>
  );
}
