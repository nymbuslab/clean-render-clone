import { useState, useMemo } from "react";
import { Plus, Search, MoreHorizontal, Filter, Eye, Edit, Trash2, Copy, ArrowUpDown, Package } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { mockProducts } from "@/data/mockData";
import { useToast } from "@/hooks/use-toast";
import ProductFormDialog, { type ProductFormData } from "@/components/admin/ProductFormDialog";
import ProductDetailsSheet from "@/components/admin/ProductDetailsSheet";
import DeleteProductDialog from "@/components/admin/DeleteProductDialog";

type SortKey = "name" | "price" | "stock";
type SortDir = "asc" | "desc";

export default function ProductsPage() {
  const { toast } = useToast();

  // State
  const [products, setProducts] = useState<ProductFormData[]>(
    mockProducts.map((p) => ({
      ...p,
      description: "",
      compareAtPrice: 0,
      cost: 0,
      sku: "",
      barcode: "",
      images: [],
      weight: "",
      tags: [],
      status: p.status as "active" | "inactive",
    }))
  );

  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortKey, setSortKey] = useState<SortKey>("name");
  const [sortDir, setSortDir] = useState<SortDir>("asc");

  // Dialogs
  const [formOpen, setFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<ProductFormData | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<ProductFormData | null>(null);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deletingProduct, setDeletingProduct] = useState<ProductFormData | null>(null);

  const fmt = (v: number) => v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

  // Categories from current products
  const categories = useMemo(() => [...new Set(products.map((p) => p.category))].sort(), [products]);

  // Filter & sort
  const filtered = useMemo(() => {
    let list = [...products];
    if (search) {
      const q = search.toLowerCase();
      list = list.filter((p) => p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q) || p.sku?.toLowerCase().includes(q));
    }
    if (categoryFilter !== "all") list = list.filter((p) => p.category === categoryFilter);
    if (statusFilter !== "all") list = list.filter((p) => p.status === statusFilter);

    list.sort((a, b) => {
      const mul = sortDir === "asc" ? 1 : -1;
      if (sortKey === "name") return a.name.localeCompare(b.name) * mul;
      if (sortKey === "price") return (a.price - b.price) * mul;
      return (a.stock - b.stock) * mul;
    });

    return list;
  }, [products, search, categoryFilter, statusFilter, sortKey, sortDir]);

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else { setSortKey(key); setSortDir("asc"); }
  };

  // CRUD handlers
  const handleSave = (product: ProductFormData) => {
    setProducts((prev) => {
      const idx = prev.findIndex((p) => p.id === product.id);
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = product;
        return copy;
      }
      return [...prev, product];
    });
    toast({
      title: editingProduct ? "Produto atualizado" : "Produto criado",
      description: product.name,
    });
    setEditingProduct(null);
  };

  const handleDelete = () => {
    if (!deletingProduct) return;
    setProducts((prev) => prev.filter((p) => p.id !== deletingProduct.id));
    toast({ title: "Produto excluído", description: deletingProduct.name });
    setDeletingProduct(null);
    setDeleteOpen(false);
    setDetailsOpen(false);
  };

  const handleDuplicate = (product: ProductFormData) => {
    const dup: ProductFormData = {
      ...product,
      id: crypto.randomUUID(),
      name: `${product.name} (Cópia)`,
      sku: "",
    };
    setProducts((prev) => [...prev, dup]);
    toast({ title: "Produto duplicado", description: dup.name });
    setDetailsOpen(false);
  };

  const openNew = () => { setEditingProduct(null); setFormOpen(true); };
  const openEdit = (p: ProductFormData) => { setEditingProduct(p); setFormOpen(true); setDetailsOpen(false); };
  const openDetails = (p: ProductFormData) => { setSelectedProduct(p); setDetailsOpen(true); };
  const openDelete = (p: ProductFormData) => { setDeletingProduct(p); setDeleteOpen(true); };

  // Stats
  const activeCount = products.filter((p) => p.status === "active").length;
  const outOfStock = products.filter((p) => p.stock === 0).length;
  const totalValue = products.reduce((acc, p) => acc + p.price * p.stock, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Produtos</h1>
          <p className="text-muted-foreground text-sm">{products.length} produtos cadastrados</p>
        </div>
        <Button className="gradient-primary text-primary-foreground" onClick={openNew}>
          <Plus className="h-4 w-4 mr-2" /> Novo Produto
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Total", value: products.length, icon: Package },
          { label: "Ativos", value: activeCount, className: "text-success" },
          { label: "Sem estoque", value: outOfStock, className: "text-destructive" },
          { label: "Valor em estoque", value: fmt(totalValue) },
        ].map((stat, i) => (
          <Card key={i} className="shadow-card">
            <CardContent className="p-4">
              <p className="text-xs text-muted-foreground">{stat.label}</p>
              <p className={`text-lg font-bold mt-1 truncate ${stat.className ?? ""}`}>{stat.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Table */}
      <Card className="shadow-card">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-3 flex-wrap">
            <div className="relative flex-1 min-w-[200px] max-w-sm">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar produto, SKU..."
                className="pl-9 h-9"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-[160px] h-9">
                <Filter className="h-3.5 w-3.5 mr-1.5 text-muted-foreground" />
                <SelectValue placeholder="Categoria" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas categorias</SelectItem>
                {categories.map((c) => (
                  <SelectItem key={c} value={c}>{c}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[130px] h-9">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="active">Ativos</SelectItem>
                <SelectItem value="inactive">Inativos</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          {filtered.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <Package className="h-12 w-12 mx-auto mb-3 opacity-30" />
              <p className="font-medium">Nenhum produto encontrado</p>
              <p className="text-sm mt-1">Tente ajustar os filtros ou criar um novo produto.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-muted-foreground">
                    <th className="text-left py-2 font-medium">
                      <button onClick={() => toggleSort("name")} className="flex items-center gap-1 hover:text-foreground transition-colors">
                        Produto <ArrowUpDown className="h-3 w-3" />
                      </button>
                    </th>
                    <th className="text-left py-2 font-medium">Categoria</th>
                    <th className="text-right py-2 font-medium">
                      <button onClick={() => toggleSort("price")} className="flex items-center gap-1 ml-auto hover:text-foreground transition-colors">
                        Preço <ArrowUpDown className="h-3 w-3" />
                      </button>
                    </th>
                    <th className="text-right py-2 font-medium">
                      <button onClick={() => toggleSort("stock")} className="flex items-center gap-1 ml-auto hover:text-foreground transition-colors">
                        Estoque <ArrowUpDown className="h-3 w-3" />
                      </button>
                    </th>
                    <th className="text-center py-2 font-medium">Status</th>
                    <th className="py-2 w-10"></th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((p) => (
                    <tr
                      key={p.id}
                      className="border-b last:border-0 hover:bg-muted/50 transition-colors cursor-pointer"
                      onClick={() => openDetails(p)}
                    >
                      <td className="py-3">
                        <div className="flex items-center gap-3">
                          <img src={p.image} alt={p.name} className="h-10 w-10 rounded-lg object-cover" />
                          <div>
                            <span className="font-medium">{p.name}</span>
                            {p.sku && <p className="text-xs text-muted-foreground font-mono">{p.sku}</p>}
                          </div>
                        </div>
                      </td>
                      <td className="py-3 text-muted-foreground">{p.category}</td>
                      <td className="py-3 text-right font-medium">{fmt(p.price)}</td>
                      <td className="py-3 text-right">
                        <span className={p.stock === 0 ? "text-destructive font-medium" : ""}>
                          {p.stock === 0 ? "Esgotado" : p.stock}
                        </span>
                      </td>
                      <td className="py-3 text-center">
                        <Badge
                          variant="secondary"
                          className={`text-xs border-0 ${p.status === "active" ? "bg-success/10 text-success" : "bg-muted text-muted-foreground"}`}
                        >
                          {p.status === "active" ? "Ativo" : "Inativo"}
                        </Badge>
                      </td>
                      <td className="py-3" onClick={(e) => e.stopPropagation()}>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => openDetails(p)}>
                              <Eye className="h-4 w-4 mr-2" /> Ver detalhes
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => openEdit(p)}>
                              <Edit className="h-4 w-4 mr-2" /> Editar
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleDuplicate(p)}>
                              <Copy className="h-4 w-4 mr-2" /> Duplicar
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-destructive" onClick={() => openDelete(p)}>
                              <Trash2 className="h-4 w-4 mr-2" /> Excluir
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Dialogs */}
      <ProductFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        product={editingProduct}
        onSave={handleSave}
      />
      <ProductDetailsSheet
        open={detailsOpen}
        onOpenChange={setDetailsOpen}
        product={selectedProduct}
        onEdit={() => selectedProduct && openEdit(selectedProduct)}
        onDelete={() => selectedProduct && openDelete(selectedProduct)}
        onDuplicate={() => selectedProduct && handleDuplicate(selectedProduct)}
      />
      <DeleteProductDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        productName={deletingProduct?.name ?? ""}
        onConfirm={handleDelete}
      />
    </div>
  );
}
