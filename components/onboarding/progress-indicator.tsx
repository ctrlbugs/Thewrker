"use client";

interface ProgressIndicatorProps {
  currentStep: number;
  totalSteps: number;
  steps: string[];
}

export default function ProgressIndicator({ currentStep, totalSteps, steps }: ProgressIndicatorProps) {
  return (
    <div className="w-full mb-8">
      {/* Progress Bar */}
      <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
        <div
          className="bg-gradient-to-r from-brand-secondary to-brand-secondary/80 h-2 rounded-full transition-all duration-500 ease-out"
          style={{ width: `${(currentStep / totalSteps) * 100}%` }}
        />
      </div>
      
      {/* Step Labels */}
      <div className="flex items-center justify-between">
        {steps.map((step, index) => {
          const stepNumber = index + 1;
          const isCompleted = stepNumber < currentStep;
          const isCurrent = stepNumber === currentStep;
          
          return (
            <div key={index} className="flex items-center flex-1">
              <div className="flex flex-col items-center flex-1">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold text-sm transition-all ${
                    isCompleted
                      ? "bg-brand-secondary text-white"
                      : isCurrent
                      ? "bg-brand-secondary text-white scale-110 shadow-lg shadow-brand-secondary/50"
                      : "bg-gray-200 text-gray-500"
                  }`}
                >
                  {isCompleted ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    stepNumber
                  )}
                </div>
                <span
                  className={`mt-2 text-xs font-medium text-center hidden sm:block ${
                    isCurrent ? "text-brand-secondary" : "text-gray-500"
                  }`}
                >
                  {step}
                </span>
              </div>
              {index < steps.length - 1 && (
                <div
                  className={`h-0.5 flex-1 mx-2 hidden sm:block ${
                    isCompleted ? "bg-brand-secondary" : "bg-gray-200"
                  }`}
                />
              )}
            </div>
          );
        })}
      </div>
      
      {/* Mobile Step Counter */}
      <div className="text-center mt-4 sm:hidden">
        <span className="text-sm text-gray-600">
          Step {currentStep} of {totalSteps}
        </span>
      </div>
    </div>
  );
}

