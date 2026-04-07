import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Upload, X, ImagePlus } from "lucide-react";

export interface ProductFormData {
  id?: string;
  name: string;
  description: string;
  price: number;
  compareAtPrice: number;
  cost: number;
  sku: string;
  barcode: string;
  stock: number;
  category: string;
  status: "active" | "inactive";
  image: string;
  images: string[];
  weight: string;
  tags: string[];
}

const emptyProduct: ProductFormData = {
  name: "",
  description: "",
  price: 0,
  compareAtPrice: 0,
  cost: 0,
  sku: "",
  barcode: "",
  stock: 0,
  category: "",
  status: "active",
  image: "",
  images: [],
  weight: "",
  tags: [],
};

const categories = ["Camisetas", "Calças", "Calçados", "Jaquetas", "Acessórios", "Bermudas"];

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product?: ProductFormData | null;
  onSave: (product: ProductFormData) => void;
}

export default function ProductFormDialog({ open, onOpenChange, product, onSave }: Props) {
  const [form, setForm] = useState<ProductFormData>(emptyProduct);
  const [tagInput, setTagInput] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const isEditing = !!product?.id;

  useEffect(() => {
    if (product) {
      setForm({ ...emptyProduct, ...product });
    } else {
      setForm(emptyProduct);
    }
    setErrors({});
    setTagInput("");
  }, [product, open]);

  const set = (field: keyof ProductFormData, value: unknown) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = "Nome é obrigatório";
    if (form.price <= 0) e.price = "Preço deve ser maior que zero";
    if (!form.category) e.category = "Selecione uma categoria";
    if (form.stock < 0) e.stock = "Estoque não pode ser negativo";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSave = () => {
    if (!validate()) return;
    onSave({
      ...form,
      id: form.id || crypto.randomUUID(),
    });
    onOpenChange(false);
  };

  const addTag = () => {
    const tag = tagInput.trim();
    if (tag && !form.tags.includes(tag)) {
      set("tags", [...form.tags, tag]);
    }
    setTagInput("");
  };

  const removeTag = (tag: string) => {
    set("tags", form.tags.filter((t) => t !== tag));
  };

  const fmt = (v: number) => v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

  const margin = form.price > 0 && form.cost > 0
    ? (((form.price - form.cost) / form.price) * 100).toFixed(1)
    : null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl">
            {isEditing ? "Editar Produto" : "Novo Produto"}
          </DialogTitle>
        </DialogHeader>

        <div className="grid gap-6 py-4">
          {/* Basic Info */}
          <div className="space-y-4">
            <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider">
              Informações Básicas
            </h3>
            <div className="grid gap-4">
              <div>
                <Label htmlFor="name">Nome do produto *</Label>
                <Input
                  id="name"
                  value={form.name}
                  onChange={(e) => set("name", e.target.value)}
                  placeholder="Ex: Camiseta Básica Algodão"
                  className={errors.name ? "border-destructive" : ""}
                />
                {errors.name && <p className="text-xs text-destructive mt-1">{errors.name}</p>}
              </div>
              <div>
                <Label htmlFor="description">Descrição</Label>
                <Textarea
                  id="description"
                  value={form.description}
                  onChange={(e) => set("description", e.target.value)}
                  placeholder="Descreva o produto detalhadamente..."
                  rows={4}
                />
              </div>
            </div>
          </div>

          {/* Images */}
          <div className="space-y-4">
            <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider">
              Imagens
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {form.image && (
                <div className="relative aspect-square rounded-lg overflow-hidden border bg-muted">
                  <img src={form.image} alt="" className="w-full h-full object-cover" />
                  <Badge className="absolute top-1 left-1 text-[10px] h-5">Principal</Badge>
                </div>
              )}
              {form.images.map((img, i) => (
                <div key={i} className="relative aspect-square rounded-lg overflow-hidden border bg-muted">
                  <img src={img} alt="" className="w-full h-full object-cover" />
                  <button
                    onClick={() => set("images", form.images.filter((_, j) => j !== i))}
                    className="absolute top-1 right-1 h-5 w-5 rounded-full bg-destructive text-destructive-foreground flex items-center justify-center"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
              <button className="aspect-square rounded-lg border-2 border-dashed border-muted-foreground/30 flex flex-col items-center justify-center gap-1 text-muted-foreground hover:border-primary hover:text-primary transition-colors">
                <ImagePlus className="h-6 w-6" />
                <span className="text-[10px]">Adicionar</span>
              </button>
            </div>
          </div>

          {/* Pricing */}
          <div className="space-y-4">
            <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider">
              Preços
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="price">Preço de venda *</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">R$</span>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    min="0"
                    value={form.price || ""}
                    onChange={(e) => set("price", parseFloat(e.target.value) || 0)}
                    className={`pl-10 ${errors.price ? "border-destructive" : ""}`}
                  />
                </div>
                {errors.price && <p className="text-xs text-destructive mt-1">{errors.price}</p>}
              </div>
              <div>
                <Label htmlFor="compareAtPrice">Preço comparativo</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">R$</span>
                  <Input
                    id="compareAtPrice"
                    type="number"
                    step="0.01"
                    min="0"
                    value={form.compareAtPrice || ""}
                    onChange={(e) => set("compareAtPrice", parseFloat(e.target.value) || 0)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="cost">Custo</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">R$</span>
                  <Input
                    id="cost"
                    type="number"
                    step="0.01"
                    min="0"
                    value={form.cost || ""}
                    onChange={(e) => set("cost", parseFloat(e.target.value) || 0)}
                    className="pl-10"
                  />
                </div>
              </div>
            </div>
            {margin && (
              <p className="text-sm text-muted-foreground">
                Margem de lucro: <span className="font-semibold text-success">{margin}%</span>
                {" "}· Lucro: <span className="font-semibold">{fmt(form.price - form.cost)}</span>
              </p>
            )}
          </div>

          {/* Inventory */}
          <div className="space-y-4">
            <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider">
              Estoque & Identificação
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="sku">SKU</Label>
                <Input
                  id="sku"
                  value={form.sku}
                  onChange={(e) => set("sku", e.target.value)}
                  placeholder="CAM-BAS-001"
                />
              </div>
              <div>
                <Label htmlFor="barcode">Código de barras</Label>
                <Input
                  id="barcode"
                  value={form.barcode}
                  onChange={(e) => set("barcode", e.target.value)}
                  placeholder="7891234567890"
                />
              </div>
              <div>
                <Label htmlFor="stock">Estoque *</Label>
                <Input
                  id="stock"
                  type="number"
                  min="0"
                  value={form.stock}
                  onChange={(e) => set("stock", parseInt(e.target.value) || 0)}
                  className={errors.stock ? "border-destructive" : ""}
                />
                {errors.stock && <p className="text-xs text-destructive mt-1">{errors.stock}</p>}
              </div>
              <div>
                <Label htmlFor="weight">Peso (kg)</Label>
                <Input
                  id="weight"
                  value={form.weight}
                  onChange={(e) => set("weight", e.target.value)}
                  placeholder="0.350"
                />
              </div>
            </div>
          </div>

          {/* Organization */}
          <div className="space-y-4">
            <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider">
              Organização
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label>Categoria *</Label>
                <Select value={form.category} onValueChange={(v) => set("category", v)}>
                  <SelectTrigger className={errors.category ? "border-destructive" : ""}>
                    <SelectValue placeholder="Selecione..." />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((c) => (
                      <SelectItem key={c} value={c}>{c}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.category && <p className="text-xs text-destructive mt-1">{errors.category}</p>}
              </div>
              <div className="flex items-center gap-3 pt-6">
                <Switch
                  checked={form.status === "active"}
                  onCheckedChange={(v) => set("status", v ? "active" : "inactive")}
                />
                <Label>Produto ativo</Label>
              </div>
            </div>

            {/* Tags */}
            <div>
              <Label>Tags</Label>
              <div className="flex gap-2 mt-1">
                <Input
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  placeholder="Adicionar tag..."
                  onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addTag())}
                  className="flex-1"
                />
                <Button type="button" variant="outline" size="sm" onClick={addTag}>
                  Adicionar
                </Button>
              </div>
              {form.tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {form.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="gap-1">
                      {tag}
                      <button onClick={() => removeTag(tag)}>
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 pt-4 border-t">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button className="gradient-primary text-primary-foreground" onClick={handleSave}>
            {isEditing ? "Salvar Alterações" : "Criar Produto"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
