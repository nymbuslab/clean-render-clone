import { useState, useMemo } from "react";
import { Search, Mail, Plus, Users, DollarSign, ShoppingCart, TrendingUp, Filter } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { mockCustomers } from "@/data/mockData";
import CustomerDetailsSheet, { type Customer } from "@/components/admin/CustomerDetailsSheet";
import CustomerFormDialog from "@/components/admin/CustomerFormDialog";

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>(
    mockCustomers.map(c => c as Customer)
  );
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("todos");
  const [sortBy, setSortBy] = useState("name");
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [formOpen, setFormOpen] = useState(false);

  const fmt = (v: number) => v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

  const filtered = useMemo(() => {
    let list = [...customers];
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(c => c.name.toLowerCase().includes(q) || c.email.toLowerCase().includes(q) || c.phone?.includes(q));
    }
    if (statusFilter !== "todos") list = list.filter(c => c.status === statusFilter);
    list.sort((a, b) => {
      if (sortBy === "name") return a.name.localeCompare(b.name);
      if (sortBy === "spent") return b.totalSpent - a.totalSpent;
      if (sortBy === "orders") return b.orders - a.orders;
      if (sortBy === "recent") return new Date(b.lastOrder).getTime() - new Date(a.lastOrder).getTime();
      return 0;
    });
    return list;
  }, [customers, search, statusFilter, sortBy]);

  const stats = useMemo(() => ({
    total: customers.length,
    ativos: customers.filter(c => c.status === "ativo").length,
    totalSpent: customers.reduce((s, c) => s + c.totalSpent, 0),
    avgTicket: customers.length > 0 ? customers.reduce((s, c) => s + c.totalSpent, 0) / customers.reduce((s, c) => s + c.orders, 0) : 0,
  }), [customers]);

  const openDetails = (c: Customer) => { setSelectedCustomer(c); setDetailsOpen(true); };

  const handleSaveCustomer = (updated: Customer) => {
    setCustomers(prev => prev.map(c => c.id === updated.id ? updated : c));
    setSelectedCustomer(updated);
  };

  const handleAddCustomer = (newC: Customer) => {
    setCustomers(prev => [newC, ...prev]);
  };

  const statusCounts = useMemo(() => ({
    ativo: customers.filter(c => c.status === "ativo").length,
    novo: customers.filter(c => c.status === "novo").length,
    inativo: customers.filter(c => c.status === "inativo").length,
  }), [customers]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Clientes</h1>
          <p className="text-muted-foreground text-sm">{customers.length} clientes cadastrados</p>
        </div>
        <Button onClick={() => setFormOpen(true)}><Plus className="h-4 w-4 mr-1" /> Novo Cliente</Button>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { icon: Users, label: "Total Clientes", value: stats.total, color: "text-primary" },
          { icon: Users, label: "Ativos", value: stats.ativos, color: "text-success" },
          { icon: DollarSign, label: "Receita Total", value: fmt(stats.totalSpent), color: "text-primary" },
          { icon: TrendingUp, label: "Ticket Médio", value: fmt(stats.avgTicket), color: "text-info" },
        ].map((kpi, i) => (
          <Card key={i} className="shadow-card">
            <CardContent className="p-4 flex items-center gap-3">
              <div className={`rounded-lg bg-muted p-2.5 ${kpi.color}`}><kpi.icon className="h-5 w-5" /></div>
              <div>
                <p className="text-xs text-muted-foreground">{kpi.label}</p>
                <p className="text-lg font-bold">{kpi.value}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Status filter chips */}
      <div className="flex gap-2 flex-wrap">
        {[
          { key: "todos", label: "Todos", count: customers.length },
          { key: "ativo", label: "Ativos", count: statusCounts.ativo },
          { key: "novo", label: "Novos", count: statusCounts.novo },
          { key: "inativo", label: "Inativos", count: statusCounts.inativo },
        ].map(s => (
          <Button key={s.key} variant={statusFilter === s.key ? "default" : "outline"} size="sm" onClick={() => setStatusFilter(s.key)}>
            {s.label} <Badge variant="secondary" className="ml-1.5 text-xs">{s.count}</Badge>
          </Button>
        ))}
      </div>

      {/* Table */}
      <Card className="shadow-card">
        <CardHeader className="pb-3">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Buscar por nome, email ou telefone..." className="pl-9 h-9" value={search} onChange={e => setSearch(e.target.value)} />
            </div>
            <div className="flex gap-2">
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-[160px] h-9"><Filter className="h-3.5 w-3.5 mr-1" /><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="name">Nome A-Z</SelectItem>
                  <SelectItem value="spent">Maior Gasto</SelectItem>
                  <SelectItem value="orders">Mais Pedidos</SelectItem>
                  <SelectItem value="recent">Mais Recentes</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {filtered.length === 0 ? (
            <p className="text-center text-muted-foreground py-12 text-sm">Nenhum cliente encontrado</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filtered.map(c => (
                <div key={c.id} onClick={() => openDetails(c)} className="rounded-xl border p-4 hover:shadow-card transition-shadow cursor-pointer">
                  <div className="flex items-center gap-3 mb-3">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback className="bg-primary/10 text-primary text-sm font-medium">
                        {c.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{c.name}</p>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Mail className="h-3 w-3" />
                        <span className="truncate">{c.email}</span>
                      </div>
                    </div>
                    <Badge variant="secondary" className={`text-xs border-0 ${
                      c.status === "ativo" ? "bg-success/10 text-success" :
                      c.status === "novo" ? "bg-info/10 text-info" : "bg-muted text-muted-foreground"
                    }`}>
                      {c.status === "ativo" ? "Ativo" : c.status === "novo" ? "Novo" : "Inativo"}
                    </Badge>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div className="rounded-lg bg-muted p-2">
                      <p className="text-lg font-bold">{c.orders}</p>
                      <p className="text-[10px] text-muted-foreground">Pedidos</p>
                    </div>
                    <div className="rounded-lg bg-muted p-2">
                      <p className="text-sm font-bold">{fmt(c.totalSpent)}</p>
                      <p className="text-[10px] text-muted-foreground">Total Gasto</p>
                    </div>
                    <div className="rounded-lg bg-muted p-2">
                      <p className="text-sm font-medium">{new Date(c.lastOrder).toLocaleDateString("pt-BR", { day: "2-digit", month: "short" })}</p>
                      <p className="text-[10px] text-muted-foreground">Última Compra</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <CustomerDetailsSheet customer={selectedCustomer} open={detailsOpen} onOpenChange={setDetailsOpen} onSave={handleSaveCustomer} />
      <CustomerFormDialog open={formOpen} onOpenChange={setFormOpen} onSave={handleAddCustomer} />
    </div>
  );
}
