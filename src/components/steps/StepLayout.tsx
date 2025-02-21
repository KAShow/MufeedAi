import React from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, Home } from "lucide-react";

interface StepLayoutProps {
  children: React.ReactNode;
  title: string;
  description: string;
  currentStep: number;
  totalSteps: number;
  onNext?: () => void;
  onPrevious?: () => void;
  isNextDisabled?: boolean;
  nextText?: string;
}

export default function StepLayout({
  children,
  title,
  description,
  currentStep,
  totalSteps,
  onNext,
  onPrevious,
  isNextDisabled,
  nextText = "التالي",
}: StepLayoutProps) {
  const navigate = useNavigate();

  const handlePrevious = () => {
    if (currentStep === 1) {
      navigate("/setup");
    } else if (currentStep === 2) {
      navigate("/steps/audience");
    } else if (currentStep === 3) {
      navigate("/steps/requirements");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5 flex items-center justify-center p-4">
      <Card className="max-w-2xl w-full p-6 space-y-8 bg-white/80 backdrop-blur-sm">
        <div className="flex justify-between items-center">
          <div className="space-y-2">
            <h1 className="text-2xl font-bold">{title}</h1>
            <p className="text-muted-foreground">{description}</p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/welcome")}
            className="hover:bg-primary/10"
            title="العودة للصفحة الرئيسية"
          >
            <Home className="h-5 w-5" />
          </Button>
        </div>

        <div className="space-y-6">{children}</div>

        <div className="flex justify-between items-center pt-4 border-t border-primary/10">
          <Button
            variant="outline"
            onClick={onPrevious || handlePrevious}
            disabled={currentStep === 0}
            className="gap-2"
          >
            <ArrowRight className="h-4 w-4" />
            السابق
          </Button>

          <div className="flex items-center gap-2">
            {Array.from({ length: totalSteps }).map((_, index) => (
              <div
                key={index}
                className={`h-2 w-2 rounded-full transition-all duration-300 transform ${
                  index === currentStep ? "bg-primary scale-125" : "bg-gray-200"
                }`}
              />
            ))}
          </div>

          <Button
            onClick={onNext}
            disabled={isNextDisabled}
            className="gap-2 bg-gradient-to-r from-primary to-secondary hover:opacity-90"
          >
            {nextText}
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </div>
      </Card>
    </div>
  );
}
