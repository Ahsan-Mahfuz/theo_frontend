'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { Tick02Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { SignupProvider } from './SignupContext';

export default function HostSignupLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  
  // Extract step number from pathname (e.g. /en/signup/host/step-2 -> 2)
  const match = pathname.match(/step-(\d+)/);
  const currentStep = match ? parseInt(match[1], 10) : 1;

  const renderStepper = () => {
    // Steps 5 and above don't show the stepper
    if (currentStep >= 5) return null;

    return (
      <div className="flex items-center mb-12">
        {[1, 2, 3, 4].map((s) => (
          <div key={s} className="flex items-center">
            {s < currentStep ? (
              // Completed step
              <div className="w-5 h-5 rounded-full bg-[#35A9D6] text-white flex items-center justify-center text-[10px]">
                <HugeiconsIcon icon={Tick02Icon} className="w-3 h-3" />
              </div>
            ) : s === currentStep ? (
              // Current step
              <div className="w-5 h-5 rounded-full bg-[#35A9D6] text-white flex items-center justify-center text-[10px]">
                <HugeiconsIcon icon={Tick02Icon} className="w-3 h-3" />
              </div>
            ) : (
              // Upcoming step
              <div className="w-5 h-5 rounded-full border border-[#35A9D6] text-[#35A9D6] flex items-center justify-center text-[10px]">
                <HugeiconsIcon icon={Tick02Icon} className="w-3 h-3" />
              </div>
            )}
            {s !== 4 && (
              <div className={`w-6 sm:w-10 h-[1px] mx-1.5 sm:mx-3 ${s < currentStep ? 'bg-[#35A9D6]' : 'bg-gray-300'}`} />
            )}
          </div>
        ))}
      </div>
    );
  };

  return (
    <SignupProvider>
      <div className="flex min-h-screen w-full bg-[#FAFAFA] flex-col items-center py-8 sm:py-16 px-4 font-sans">
        {renderStepper()}
        {children}
      </div>
    </SignupProvider>
  );
}
