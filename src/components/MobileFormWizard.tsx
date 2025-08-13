import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ChevronLeft, ChevronRight, Check } from "lucide-react";

interface WizardStep {
  id: string;
  title: string;
  description?: string;
  component: React.ReactNode;
  optional?: boolean;
}

interface MobileFormWizardProps {
  steps: WizardStep[];
  onComplete: () => void;
  onCancel: () => void;
  completable?: boolean;
}

export function MobileFormWizard({ 
  steps, 
  onComplete, 
  onCancel,
  completable = false 
}: MobileFormWizardProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());

  const progress = ((currentStep + 1) / steps.length) * 100;

  const goToNextStep = () => {
    if (currentStep < steps.length - 1) {
      setCompletedSteps(prev => new Set([...prev, currentStep]));
      setCurrentStep(currentStep + 1);
    }
  };

  const goToPreviousStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const goToStep = (stepIndex: number) => {
    setCurrentStep(stepIndex);
  };

  const handleComplete = () => {
    setCompletedSteps(prev => new Set([...prev, currentStep]));
    onComplete();
  };

  const isLastStep = currentStep === steps.length - 1;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header with Progress */}
      <div className="sticky top-0 z-10 bg-background border-b border-border p-4">
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-lg font-semibold">
            {steps[currentStep].title}
          </h1>
          <span className="text-sm text-muted-foreground">
            {currentStep + 1} of {steps.length}
          </span>
        </div>
        <Progress value={progress} className="h-2" />
        {steps[currentStep].description && (
          <p className="text-sm text-muted-foreground mt-2">
            {steps[currentStep].description}
          </p>
        )}
      </div>

      {/* Step Navigation Dots */}
      <div className="flex justify-center gap-2 py-3 bg-muted/30">
        {steps.map((step, index) => (
          <button
            key={step.id}
            onClick={() => goToStep(index)}
            className={`w-2 h-2 rounded-full transition-colors ${
              index === currentStep
                ? "bg-primary"
                : completedSteps.has(index)
                ? "bg-green-500"
                : index < currentStep
                ? "bg-muted-foreground"
                : "bg-muted"
            }`}
            aria-label={`Go to step ${index + 1}: ${step.title}`}
          />
        ))}
      </div>

      {/* Step Content */}
      <div className="flex-1 p-4 pb-20">
        <Card className="bg-card border-border">
          <CardContent className="p-4">
            {steps[currentStep].component}
          </CardContent>
        </Card>
      </div>

      {/* Navigation Footer */}
      <div className="fixed bottom-0 left-0 right-0 bg-background border-t border-border p-4">
        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={currentStep === 0 ? onCancel : goToPreviousStep}
            className="flex-1"
          >
            {currentStep === 0 ? (
              "Cancel"
            ) : (
              <>
                <ChevronLeft className="w-4 h-4 mr-2" />
                Back
              </>
            )}
          </Button>
          
          <Button
            onClick={isLastStep ? handleComplete : goToNextStep}
            disabled={isLastStep && !completable}
            className="flex-1"
          >
            {isLastStep ? (
              <>
                <Check className="w-4 h-4 mr-2" />
                Complete
              </>
            ) : (
              <>
                Next
                <ChevronRight className="w-4 h-4 ml-2" />
              </>
            )}
          </Button>
        </div>
        
        {steps[currentStep].optional && (
          <p className="text-xs text-muted-foreground text-center mt-2">
            This step is optional
          </p>
        )}
      </div>
    </div>
  );
}