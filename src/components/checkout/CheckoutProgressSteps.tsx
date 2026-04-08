import { ChevronRight } from "lucide-react";

interface Props {
  currentStep: number;
}

const steps = ["Carrinho", "Checkout", "Confirmação"];

export default function CheckoutProgressSteps({ currentStep }: Props) {
  return (
    <div className="flex items-center justify-center gap-2 mb-8 text-sm">
      {steps.map((label, idx) => {
        const step = idx + 1;
        const isActive = step === currentStep;
        return (
          <span key={step} className="contents">
            {idx > 0 && <ChevronRight className="h-4 w-4 text-muted-foreground/50" />}
            <span className={`flex items-center gap-1.5 ${isActive ? "text-primary font-medium" : "text-muted-foreground"}`}>
              <span className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-medium ${isActive ? "bg-primary text-primary-foreground" : "bg-muted"}`}>
                {step}
              </span>
              {label}
            </span>
          </span>
        );
      })}
    </div>
  );
}
