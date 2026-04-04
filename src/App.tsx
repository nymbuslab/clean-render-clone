import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "./pages/NotFound.tsx";
import LandingPage from "./pages/LandingPage.tsx";
import AdminLayout from "./components/admin/AdminLayout.tsx";
import DashboardPage from "./pages/admin/DashboardPage.tsx";
import ProductsPage from "./pages/admin/ProductsPage.tsx";
import OrdersPage from "./pages/admin/OrdersPage.tsx";
import CustomersPage from "./pages/admin/CustomersPage.tsx";
import ReportsPage from "./pages/admin/ReportsPage.tsx";
import ShippingPage from "./pages/admin/ShippingPage.tsx";
import PaymentsPage from "./pages/admin/PaymentsPage.tsx";
import SettingsPage from "./pages/admin/SettingsPage.tsx";
import StoreLayout from "./components/store/StoreLayout.tsx";
import StorePage from "./pages/store/StorePage.tsx";
import ProductPage from "./pages/store/ProductPage.tsx";
import CartPage from "./pages/store/CartPage.tsx";
import CheckoutPage from "./pages/store/CheckoutPage.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          
          {/* Admin */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<DashboardPage />} />
            <Route path="produtos" element={<ProductsPage />} />
            <Route path="pedidos" element={<OrdersPage />} />
            <Route path="clientes" element={<CustomersPage />} />
            <Route path="relatorios" element={<ReportsPage />} />
            <Route path="envios" element={<ShippingPage />} />
            <Route path="pagamentos" element={<PaymentsPage />} />
            <Route path="configuracoes" element={<SettingsPage />} />
          </Route>

          {/* Store */}
          <Route path="/loja" element={<StoreLayout />}>
            <Route index element={<StorePage />} />
            <Route path="produto/:id" element={<ProductPage />} />
            <Route path="carrinho" element={<CartPage />} />
            <Route path="checkout" element={<CheckoutPage />} />
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
