import { Outlet, Link } from "react-router-dom";
import { ShoppingCart, Search, User, Store } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

export default function StoreLayout() {
  return (
    <div className="min-h-screen bg-store-bg">
      {/* Top bar */}
      <div className="bg-foreground">
        <div className="container mx-auto flex items-center justify-between px-4 py-1.5 text-xs text-background/70">
          <span>Frete grátis acima de R$ 199</span>
          <span>Atendimento: (11) 99999-0000</span>
        </div>
      </div>

      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-store-surface shadow-sm">
        <div className="container mx-auto flex items-center justify-between px-4 py-3">
          <Link to="/loja" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg gradient-primary">
              <Store className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-foreground">MinhaLoja</span>
          </Link>

          <div className="hidden md:flex items-center gap-6 text-sm font-medium text-muted-foreground">
            <Link to="/loja" className="hover:text-foreground transition-colors">Início</Link>
            <Link to="/loja" className="hover:text-foreground transition-colors">Camisetas</Link>
            <Link to="/loja" className="hover:text-foreground transition-colors">Calças</Link>
            <Link to="/loja" className="hover:text-foreground transition-colors">Calçados</Link>
            <Link to="/loja" className="hover:text-foreground transition-colors">Acessórios</Link>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative hidden lg:block">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Buscar..." className="w-48 pl-9 h-9 bg-secondary" />
            </div>
            <Button variant="ghost" size="icon"><User className="h-5 w-5" /></Button>
            <Link to="/loja/carrinho">
              <Button variant="ghost" size="icon" className="relative">
                <ShoppingCart className="h-5 w-5" />
                <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-[10px] gradient-primary text-primary-foreground border-0">
                  3
                </Badge>
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main>
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="border-t bg-store-surface mt-12">
        <div className="container mx-auto px-4 py-10">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg gradient-primary">
                  <Store className="h-3.5 w-3.5 text-primary-foreground" />
                </div>
                <span className="font-bold">MinhaLoja</span>
              </div>
              <p className="text-sm text-muted-foreground">Sua loja de moda online com os melhores preços e qualidade.</p>
            </div>
            <div>
              <h4 className="font-semibold text-sm mb-3">Institucional</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>Sobre nós</li><li>Política de privacidade</li><li>Termos de uso</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-sm mb-3">Atendimento</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>Central de ajuda</li><li>Trocas e devoluções</li><li>Fale conosco</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-sm mb-3">Pagamento</h4>
              <p className="text-sm text-muted-foreground">Cartão de crédito, Pix, Boleto bancário</p>
              <h4 className="font-semibold text-sm mt-4 mb-2">Segurança</h4>
              <p className="text-sm text-muted-foreground">Compra 100% segura</p>
            </div>
          </div>
          <div className="border-t mt-8 pt-6 text-center text-xs text-muted-foreground">
            © 2024 MinhaLoja. Todos os direitos reservados.
          </div>
        </div>
      </footer>
    </div>
  );
}
