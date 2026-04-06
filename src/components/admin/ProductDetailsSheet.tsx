import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Edit, Trash2, Copy, ExternalLink, Package, BarChart3 } from "lucide-react";

interface Product {
  id: string;
  name: string;
  description?: string;
  price: number;
  compareAtPrice?: number;
  cost?: number;
  sku?: string;
  barcode?: string;
  stock: number;
  category: string;
  status: string;
  image: string;
  images?: string[];
  weight?: string;
  tags?: string[];
}

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product: Product | null;
  onEdit: () => void;
  onDelete: () => void;
  onDuplicate: () => void;
}

export default function ProductDetailsSheet({ open, onOpenChange, product, onEdit, onDelete, onDuplicate }: Props) {
  if (!product) return null;

  const fmt = (v: number) => v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
  const margin = product.price > 0 && (product.cost ?? 0) > 0
    ? (((product.price - (product.cost ?? 0)) / product.price) * 100).toFixed(1)
    : null;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-lg overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="text-left">Detalhes do Produto</SheetTitle>
        </SheetHeader>

        <div className="mt-6 space-y-6">
          {/* Image */}
          <div className="aspect-video rounded-xl overflow-hidden bg-muted">
            <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
          </div>

          {/* Gallery */}
          {product.images && product.images.length > 0 && (
            <div className="flex gap-2 overflow-x-auto pb-1">
              {product.images.map((img, i) => (
                <div key={i} className="h-16 w-16 rounded-lg overflow-hidden shrink-0 border">
                  <img src={img} alt="" className="h-full w-full object-cover" />
                </div>
              ))}
            </div>
          )}

          {/* Header */}
          <div>
            <div className="flex items-start justify-between gap-3">
              <h2 className="text-lg font-semibold leading-tight">{product.name}</h2>
              <Badge
                variant="secondary"
                className={`shrink-0 text-xs ${product.status === "active" ? "bg-success/10 text-success" : "bg-muted text-muted-foreground"}`}
              >
                {product.status === "active" ? "Ativo" : "Inativo"}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground mt-1">{product.category}</p>
          </div>

          {product.description && (
            <p className="text-sm text-muted-foreground">{product.description}</p>
          )}

          <Separator />

          {/* Pricing */}
          <div>
            <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
              <BarChart3 className="h-4 w-4 text-primary" /> Preços
            </h3>
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-muted/50 rounded-lg p-3 text-center">
                <p className="text-xs text-muted-foreground">Venda</p>
                <p className="font-semibold text-lg">{fmt(product.price)}</p>
              </div>
              {(product.compareAtPrice ?? 0) > 0 && (
                <div className="bg-muted/50 rounded-lg p-3 text-center">
                  <p className="text-xs text-muted-foreground">Comparativo</p>
                  <p className="font-semibold text-lg line-through text-muted-foreground">{fmt(product.compareAtPrice!)}</p>
                </div>
              )}
              {(product.cost ?? 0) > 0 && (
                <div className="bg-muted/50 rounded-lg p-3 text-center">
                  <p className="text-xs text-muted-foreground">Custo</p>
                  <p className="font-semibold text-lg">{fmt(product.cost!)}</p>
                </div>
              )}
            </div>
            {margin && (
              <p className="text-xs text-muted-foreground mt-2">
                Margem: <span className="text-success font-medium">{margin}%</span> · Lucro: {fmt(product.price - (product.cost ?? 0))}
              </p>
            )}
          </div>

          <Separator />

          {/* Inventory */}
          <div>
            <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
              <Package className="h-4 w-4 text-primary" /> Estoque & Identificação
            </h3>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="flex justify-between bg-muted/50 rounded-lg p-3">
                <span className="text-muted-foreground">Estoque</span>
                <span className={`font-medium ${product.stock === 0 ? "text-destructive" : ""}`}>
                  {product.stock === 0 ? "Esgotado" : `${product.stock} un.`}
                </span>
              </div>
              {product.sku && (
                <div className="flex justify-between bg-muted/50 rounded-lg p-3">
                  <span className="text-muted-foreground">SKU</span>
                  <span className="font-mono text-xs">{product.sku}</span>
                </div>
              )}
              {product.barcode && (
                <div className="flex justify-between bg-muted/50 rounded-lg p-3">
                  <span className="text-muted-foreground">EAN</span>
                  <span className="font-mono text-xs">{product.barcode}</span>
                </div>
              )}
              {product.weight && (
                <div className="flex justify-between bg-muted/50 rounded-lg p-3">
                  <span className="text-muted-foreground">Peso</span>
                  <span>{product.weight} kg</span>
                </div>
              )}
            </div>
          </div>

          {/* Tags */}
          {product.tags && product.tags.length > 0 && (
            <>
              <Separator />
              <div>
                <h3 className="text-sm font-semibold mb-2">Tags</h3>
                <div className="flex flex-wrap gap-1.5">
                  {product.tags.map((tag) => (
                    <Badge key={tag} variant="outline" className="text-xs">{tag}</Badge>
                  ))}
                </div>
              </div>
            </>
          )}

          <Separator />

          {/* Actions */}
          <div className="flex flex-col gap-2">
            <Button onClick={onEdit} className="gradient-primary text-primary-foreground">
              <Edit className="h-4 w-4 mr-2" /> Editar Produto
            </Button>
            <div className="flex gap-2">
              <Button variant="outline" className="flex-1" onClick={onDuplicate}>
                <Copy className="h-4 w-4 mr-2" /> Duplicar
              </Button>
              <Button variant="outline" className="flex-1 text-destructive hover:text-destructive" onClick={onDelete}>
                <Trash2 className="h-4 w-4 mr-2" /> Excluir
              </Button>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
