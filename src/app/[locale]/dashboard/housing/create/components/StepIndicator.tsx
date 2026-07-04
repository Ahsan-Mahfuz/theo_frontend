import React from 'react';

export function StepIndicator({ currentStep }: { currentStep: number }) {
  const totalSteps = 5;

  return (
    <div className="flex items-center justify-center mb-10 w-full">
      <div className="flex items-center">
        {Array.from({ length: totalSteps }).map((_, index) => {
          const stepNumber = index + 1;
          const isActive = stepNumber <= currentStep;
          
          return (
            <React.Fragment key={stepNumber}>
              <div 
                className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold transition-colors ${
                  isActive ? 'bg-[#0084FF] text-white' : 'bg-white border border-gray-200 text-gray-400'
                }`}
              >
                {stepNumber}
              </div>
              {stepNumber < totalSteps && (
                <div 
                  className={`w-12 h-px transition-colors ${
                    isActive && stepNumber < currentStep ? 'bg-[#0084FF]' : 'bg-gray-200'
                  }`}
                />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}
