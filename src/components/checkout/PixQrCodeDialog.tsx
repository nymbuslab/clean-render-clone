import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { CheckCircle, Copy, Clock } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface PixData {
  qr_code: string;
  qr_code_base64: string;
  ticket_url?: string;
}

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  pixData: PixData | null;
  total: number;
  fmt: (v: number) => string;
}

export default function PixQrCodeDialog({ open, onOpenChange, pixData, total, fmt }: Props) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (pixData?.qr_code) {
      navigator.clipboard.writeText(pixData.qr_code);
      setCopied(true);
      toast.success("Código Pix copiado!");
      setTimeout(() => setCopied(false), 3000);
    }
  };

  if (!pixData) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-success" />
            Pagamento via Pix
          </DialogTitle>
          <DialogDescription>
            Escaneie o QR Code ou copie o código para pagar
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col items-center space-y-4 py-4">
          {/* QR Code */}
          <div className="bg-white p-4 rounded-xl border-2 border-dashed border-muted">
            {pixData.qr_code_base64 ? (
              <img
                src={`data:image/png;base64,${pixData.qr_code_base64}`}
                alt="QR Code Pix"
                className="h-48 w-48"
              />
            ) : (
              <div className="h-48 w-48 flex items-center justify-center text-muted-foreground text-sm">
                QR Code indisponível
              </div>
            )}
          </div>

          {/* Amount */}
          <div className="text-center">
            <p className="text-sm text-muted-foreground">Valor com desconto Pix (5% off)</p>
            <p className="text-2xl font-bold text-primary">{fmt(total * 0.95)}</p>
          </div>

          {/* Expiration */}
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Clock className="h-3.5 w-3.5" />
            <span>Este código expira em 30 minutos</span>
          </div>

          {/* Copy button */}
          <Button
            variant="outline"
            className="w-full"
            onClick={handleCopy}
          >
            {copied ? (
              <><CheckCircle className="h-4 w-4 mr-2 text-success" /> Copiado!</>
            ) : (
              <><Copy className="h-4 w-4 mr-2" /> Copiar código Pix</>
            )}
          </Button>

          {/* Pix code (truncated) */}
          {pixData.qr_code && (
            <div className="w-full bg-muted/50 rounded-lg p-3">
              <p className="text-[10px] text-muted-foreground font-mono break-all line-clamp-3">
                {pixData.qr_code}
              </p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
