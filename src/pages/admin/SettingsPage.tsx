import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Configurações</h1>
        <p className="text-muted-foreground text-sm">Gerencie as configurações da sua loja</p>
      </div>

      <Tabs defaultValue="store" className="space-y-6">
        <TabsList>
          <TabsTrigger value="store">Loja</TabsTrigger>
          <TabsTrigger value="payments">Pagamentos</TabsTrigger>
          <TabsTrigger value="shipping">Frete</TabsTrigger>
          <TabsTrigger value="subscription">Assinatura</TabsTrigger>
        </TabsList>

        <TabsContent value="store">
          <Card className="shadow-card">
            <CardHeader><CardTitle className="text-base">Dados da Loja</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Nome da Loja</Label>
                  <Input defaultValue="MinhaLoja Fashion" />
                </div>
                <div className="space-y-2">
                  <Label>E-mail</Label>
                  <Input defaultValue="contato@minhaloja.com" />
                </div>
                <div className="space-y-2">
                  <Label>Telefone</Label>
                  <Input defaultValue="(11) 99999-0000" />
                </div>
                <div className="space-y-2">
                  <Label>CNPJ</Label>
                  <Input defaultValue="12.345.678/0001-90" />
                </div>
              </div>
              <Separator />
              <div className="space-y-2">
                <Label>Endereço</Label>
                <Input defaultValue="Rua das Flores, 123 - São Paulo, SP" />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-sm">Loja ativa</p>
                  <p className="text-xs text-muted-foreground">Sua loja está visível para os clientes</p>
                </div>
                <Switch defaultChecked />
              </div>
              <Button className="gradient-primary text-primary-foreground">Salvar Alterações</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payments">
          <Card className="shadow-card">
            <CardHeader><CardTitle className="text-base">Meios de Pagamento</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between rounded-lg border p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-success/10">
                    <span className="font-bold text-success text-sm">MP</span>
                  </div>
                  <div>
                    <p className="font-medium text-sm">Mercado Pago</p>
                    <p className="text-xs text-muted-foreground">Cartão, Pix, boleto</p>
                  </div>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between rounded-lg border p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    <span className="font-bold text-primary text-sm">PG</span>
                  </div>
                  <div>
                    <p className="font-medium text-sm">Pagar.me</p>
                    <p className="text-xs text-muted-foreground">Cartão, Pix, boleto</p>
                  </div>
                </div>
                <Switch />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="shipping">
          <Card className="shadow-card">
            <CardHeader><CardTitle className="text-base">Configurações de Frete</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between rounded-lg border p-4">
                <div>
                  <p className="font-medium text-sm">Retirada na loja</p>
                  <p className="text-xs text-muted-foreground">O cliente retira o pedido no seu endereço</p>
                </div>
                <Switch defaultChecked />
              </div>
              <Separator />
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-sm">Entrega local</p>
                    <p className="text-xs text-muted-foreground">Entrega por raio em km</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Raio de atendimento (km)</Label>
                    <Input type="number" defaultValue="5" />
                  </div>
                  <div className="space-y-2">
                    <Label>Taxa de entrega (R$)</Label>
                    <Input type="number" defaultValue="8.00" />
                  </div>
                </div>
              </div>
              <Button className="gradient-primary text-primary-foreground">Salvar</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="subscription">
          <Card className="shadow-card">
            <CardHeader><CardTitle className="text-base">Assinatura da Plataforma</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-lg border-2 border-primary/20 bg-primary/5 p-5">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <p className="font-semibold">Plano Profissional</p>
                    <p className="text-sm text-muted-foreground">Todos os recursos incluídos</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-primary">R$ 97<span className="text-sm font-normal text-muted-foreground">/mês</span></p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="inline-flex h-5 items-center rounded-full bg-success/10 px-2 text-xs font-medium text-success">Ativo</span>
                  <span className="text-xs text-muted-foreground">Próxima cobrança: 15/04/2024</span>
                </div>
              </div>
              <Button variant="outline" className="w-full">Gerenciar Assinatura</Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
