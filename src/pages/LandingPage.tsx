import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Store, LayoutDashboard, ShoppingBag, ArrowRight, CheckCircle, Zap, Shield, BarChart3 } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Nav */}
      <nav className="border-b bg-card">
        <div className="container mx-auto flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg gradient-primary">
              <Store className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold">MinhaLoja</span>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/loja">
              <Button variant="ghost" size="sm">Ver Loja Demo</Button>
            </Link>
            <Link to="/admin">
              <Button size="sm" className="gradient-primary text-primary-foreground">
                Acessar Painel
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="py-20 md:py-28">
        <div className="container mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary mb-6">
            <Zap className="h-4 w-4" /> Protótipo Visual — SaaS E-commerce
          </div>
          <h1 className="text-4xl md:text-6xl font-bold max-w-3xl mx-auto leading-tight">
            Sua loja virtual completa em minutos
          </h1>
          <p className="text-lg text-muted-foreground mt-6 max-w-xl mx-auto">
            Plataforma SaaS para criar e gerenciar sua loja online. Painel intuitivo, checkout completo e relatórios em tempo real.
          </p>
          <div className="flex items-center justify-center gap-4 mt-8">
            <Link to="/admin">
              <Button size="lg" className="gradient-primary text-primary-foreground rounded-full px-8">
                <LayoutDashboard className="h-4 w-4 mr-2" /> Ver Painel Admin
              </Button>
            </Link>
            <Link to="/loja">
              <Button size="lg" variant="outline" className="rounded-full px-8">
                <ShoppingBag className="h-4 w-4 mr-2" /> Ver Loja Virtual
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 bg-muted/50">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-center mb-10">Tudo que você precisa para vender online</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Store, title: "Loja Completa", desc: "Catálogo, carrinho, checkout e área do cliente." },
              { icon: LayoutDashboard, title: "Painel Admin", desc: "Gerencie produtos, pedidos, clientes e relatórios." },
              { icon: Shield, title: "Pagamentos Seguros", desc: "Pix, cartão e boleto via Mercado Pago ou Pagar.me." },
              { icon: BarChart3, title: "Relatórios", desc: "Faturamento, ticket médio e produtos mais vendidos." },
            ].map(f => (
              <div key={f.title} className="rounded-xl bg-card p-6 shadow-card">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 mb-4">
                  <f.icon className="h-5 w-5 text-primary" />
                </div>
                <h3 className="font-semibold mb-1">{f.title}</h3>
                <p className="text-sm text-muted-foreground">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Screens preview */}
      <section className="py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold mb-3">Navegue pelo protótipo</h2>
          <p className="text-muted-foreground mb-8">Explore todas as telas do painel e da loja virtual</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
            <Link to="/admin" className="group">
              <div className="rounded-xl border-2 border-primary/20 p-8 hover:border-primary transition-colors">
                <LayoutDashboard className="h-10 w-10 text-primary mx-auto mb-4" />
                <h3 className="font-semibold text-lg">Painel Administrativo</h3>
                <p className="text-sm text-muted-foreground mt-2">Dashboard, produtos, pedidos, clientes, relatórios, envios, pagamentos e configurações.</p>
                <span className="inline-flex items-center gap-1 text-primary text-sm font-medium mt-4">
                  Acessar <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </span>
              </div>
            </Link>
            <Link to="/loja" className="group">
              <div className="rounded-xl border-2 border-accent/20 p-8 hover:border-accent transition-colors">
                <ShoppingBag className="h-10 w-10 text-accent mx-auto mb-4" />
                <h3 className="font-semibold text-lg">Loja Virtual</h3>
                <p className="text-sm text-muted-foreground mt-2">Catálogo, página de produto, carrinho e checkout completo.</p>
                <span className="inline-flex items-center gap-1 text-accent text-sm font-medium mt-4">
                  Acessar <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </span>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-6 text-center text-sm text-muted-foreground">
        <p>Protótipo Visual — Plataforma SaaS de Loja Virtual</p>
      </footer>
    </div>
  );
}
