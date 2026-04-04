import { useParams, Link } from "react-router-dom";
import { mockProducts } from "@/data/mockData";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, Minus, Plus, ChevronLeft, Truck, Shield, RotateCcw } from "lucide-react";
import { useState } from "react";

export default function ProductPage() {
  const { id } = useParams();
  const product = mockProducts.find(p => p.id === id) || mockProducts[0];
  const [qty, setQty] = useState(1);
  const fmt = (v: number) => v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
  const related = mockProducts.filter(p => p.id !== product.id && p.status === "active").slice(0, 4);

  return (
    <div className="container mx-auto px-4 py-8">
      <Link to="/loja" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-6">
        <ChevronLeft className="h-4 w-4" /> Voltar
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
        <div className="aspect-square rounded-2xl overflow-hidden bg-muted">
          <img src={product.image} alt={product.name} className="h-full w-full object-cover" />
        </div>

        <div className="space-y-5">
          <div>
            <Badge variant="secondary" className="mb-2 text-xs">{product.category}</Badge>
            <h1 className="text-2xl md:text-3xl font-bold">{product.name}</h1>
          </div>

          <div>
            <p className="text-3xl font-bold text-primary">{fmt(product.price)}</p>
            <p className="text-sm text-muted-foreground mt-1">
              ou 3x de {fmt(product.price / 3)} sem juros
            </p>
          </div>

          <p className="text-sm text-muted-foreground leading-relaxed">
            Produto de alta qualidade, feito com materiais selecionados. Conforto e estilo para o seu dia a dia.
            Disponível em diversas cores e tamanhos.
          </p>

          {/* Size */}
          <div>
            <p className="text-sm font-medium mb-2">Tamanho</p>
            <div className="flex gap-2">
              {["P", "M", "G", "GG"].map((s, i) => (
                <button key={s} className={`h-10 w-10 rounded-lg border text-sm font-medium transition-colors ${i === 1 ? "border-primary bg-primary/10 text-primary" : "hover:border-primary/50"}`}>
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Quantity */}
          <div>
            <p className="text-sm font-medium mb-2">Quantidade</p>
            <div className="flex items-center gap-3">
              <div className="flex items-center rounded-lg border">
                <button onClick={() => setQty(Math.max(1, qty - 1))} className="p-2 hover:bg-muted transition-colors">
                  <Minus className="h-4 w-4" />
                </button>
                <span className="px-4 font-medium">{qty}</span>
                <button onClick={() => setQty(qty + 1)} className="p-2 hover:bg-muted transition-colors">
                  <Plus className="h-4 w-4" />
                </button>
              </div>
              <span className="text-sm text-muted-foreground">{product.stock} disponíveis</span>
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <Button size="lg" className="flex-1 gradient-primary text-primary-foreground rounded-full">
              <ShoppingCart className="h-4 w-4 mr-2" /> Adicionar ao Carrinho
            </Button>
            <Button size="lg" variant="outline" className="rounded-full px-6">
              Comprar Agora
            </Button>
          </div>

          <div className="grid grid-cols-3 gap-3 pt-4">
            {[
              { icon: Truck, label: "Entrega rápida" },
              { icon: Shield, label: "Compra segura" },
              { icon: RotateCcw, label: "Troca grátis" },
            ].map(({ icon: Icon, label }) => (
              <div key={label} className="flex flex-col items-center gap-1 rounded-lg bg-muted p-3 text-center">
                <Icon className="h-4 w-4 text-primary" />
                <span className="text-xs text-muted-foreground">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Related */}
      <section className="mt-16">
        <h2 className="text-xl font-bold mb-6">Produtos Relacionados</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {related.map(p => (
            <Link key={p.id} to={`/loja/produto/${p.id}`} className="group">
              <div className="rounded-xl bg-card overflow-hidden shadow-card hover:shadow-elevated transition-all">
                <div className="aspect-square overflow-hidden bg-muted">
                  <img src={p.image} alt={p.name} className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300" />
                </div>
                <div className="p-3">
                  <p className="text-xs text-muted-foreground">{p.category}</p>
                  <p className="font-medium text-sm truncate">{p.name}</p>
                  <p className="text-base font-bold text-primary mt-1">{fmt(p.price)}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
