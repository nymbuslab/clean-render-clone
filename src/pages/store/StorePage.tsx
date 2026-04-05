import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { mockProducts } from "@/data/mockData";
import { ArrowRight, ShoppingCart } from "lucide-react";
import heroBanner from "@/assets/hero-banner.jpg";

export default function StorePage() {
  const fmt = (v: number) => v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
  const activeProducts = mockProducts.filter(p => p.status === "active");

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <img src={heroBanner} alt="Nova coleção de moda urbana" className="w-full h-[320px] md:h-[480px] object-cover" width={1920} height={800} />
        <div className="absolute inset-0 bg-gradient-to-r from-background/90 via-background/60 to-transparent" />
        <div className="absolute inset-0 flex items-center">
          <div className="container mx-auto px-4">
            <Badge className="mb-4 bg-primary/20 text-primary border-0 text-sm px-4 py-1">
              Nova Coleção 2024
            </Badge>
            <h1 className="text-3xl md:text-5xl font-bold text-foreground mb-4">
              Estilo que combina<br />com você
            </h1>
            <p className="text-muted-foreground text-lg mb-8 max-w-md">
              Descubra as últimas tendências em moda com preços que cabem no seu bolso.
            </p>
            <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-full px-8">
              Ver Coleção <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="container mx-auto px-4 -mt-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {["Camisetas", "Calças", "Calçados", "Acessórios"].map(cat => (
            <button key={cat} className="rounded-xl bg-card p-5 text-center shadow-card hover:shadow-elevated transition-shadow">
              <p className="font-semibold">{cat}</p>
              <p className="text-xs text-muted-foreground mt-1">Ver produtos</p>
            </button>
          ))}
        </div>
      </section>

      {/* Products */}
      <section className="container mx-auto px-4 mt-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold">Produtos em Destaque</h2>
          <Button variant="ghost" className="text-primary text-sm">Ver todos <ArrowRight className="ml-1 h-4 w-4" /></Button>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {activeProducts.map(p => (
            <Link key={p.id} to={`/loja/produto/${p.id}`} className="group">
              <div className="rounded-xl bg-card overflow-hidden shadow-card hover:shadow-elevated transition-all">
                <div className="aspect-square overflow-hidden bg-muted">
                  <img src={p.image} alt={p.name} className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300" />
                </div>
                <div className="p-3 md:p-4">
                  <p className="text-xs text-muted-foreground">{p.category}</p>
                  <p className="font-medium text-sm mt-0.5 truncate">{p.name}</p>
                  <div className="flex items-center justify-between mt-2">
                    <p className="text-lg font-bold text-primary">{fmt(p.price)}</p>
                    <Button size="icon" variant="ghost" className="h-8 w-8 rounded-full bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground">
                      <ShoppingCart className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Banner */}
      <section className="container mx-auto px-4 mt-12">
        <div className="rounded-2xl gradient-accent p-8 md:p-12 text-center">
          <h3 className="text-2xl md:text-3xl font-bold text-accent-foreground mb-2">Frete Grátis</h3>
          <p className="text-accent-foreground/80 mb-4">Em compras acima de R$ 199,00</p>
          <Button className="bg-card text-foreground hover:bg-card/90 rounded-full px-6">
            Aproveitar
          </Button>
        </div>
      </section>
    </div>
  );
}
