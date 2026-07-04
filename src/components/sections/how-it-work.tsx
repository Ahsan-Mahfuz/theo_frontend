"use client";

import { Recycle03Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";

interface Step {
  id: number;
  side: "left" | "right";
}

const steps: Step[] = [
  { id: 1, side: "left" },
  { id: 2, side: "right" },
  { id: 3, side: "left" },
  { id: 4, side: "right" },
  { id: 5, side: "left" },
  { id: 6, side: "right" },
  { id: 7, side: "left" },
];

function useInView(threshold = 0.2) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);

  return { ref, inView };
}

interface StepCardProps {
  step: Step;
  index: number;
}

const StepCard = ({ step, index }: StepCardProps) => {
  const { ref, inView } = useInView(0.15);
  const t = useTranslations('Landing');

  return (
    <div
      ref={ref}
      className={`
        relative flex items-center justify-center w-full min-h-[100px]
        transition-all duration-700 ease-out
        ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}
      `}
      style={{ transitionDelay: `${index * 100}ms` }}
    >
      {/* LEFT COLUMN (Hidden on mobile) */}
      <div className="hidden md:flex w-1/2 pr-12 md:pr-16 justify-end">
        {step.side === "left" && (
          <div className="flex items-center gap-6 md:gap-8 transition-transform hover:-translate-y-1">
            {/* Card */}
            <div className="bg-[#FCFDFD] rounded-[20px] px-8 py-7 w-full max-w-[460px] shadow-[0_4px_30px_rgb(0,0,0,0.03)] border border-slate-50">
              <h3 className="font-semibold text-slate-900 text-[16px] mb-2 text-right">
                {t(`process.step${step.id}.title`)}
              </h3>
              <p className="text-slate-500 text-[13px] leading-relaxed text-right">
                {t(`process.step${step.id}.description`)}
              </p>
            </div>
            {/* Icon Node */}
            <div className="flex flex-col items-center justify-center">
              <div className="w-12 h-12 rounded-xl bg-[#00B2AB] flex items-center justify-center shadow-lg shadow-[#00B2AB]/20 mb-2 z-10">
                <HugeiconsIcon icon={Recycle03Icon} color='#fff' size={24} />
              </div>
              <div className="px-3.5 py-[3px] bg-white border border-[#00B2AB]/30 rounded-full z-10">
                <span className="text-[11px] font-semibold text-[#00B2AB] whitespace-nowrap">
                  {t('process.step', { number: step.id })}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* RIGHT COLUMN (Used for all cards on mobile) */}
      <div className="w-full md:w-1/2 pl-6 md:pl-16 flex justify-start">
        {(step.side === "right" || true) && ( // On mobile, show ALL cards on the right
          <div className={`flex items-center gap-4 md:gap-8 transition-transform hover:-translate-y-1 ${step.side === 'left' ? 'md:hidden' : ''}`}>
            {/* Icon Node */}
            <div className="flex flex-col items-center justify-center shrink-0">
              <div className="w-12 h-12 rounded-xl bg-[#00B2AB] flex items-center justify-center shadow-lg shadow-[#00B2AB]/20 mb-2 z-10">
                <HugeiconsIcon icon={Recycle03Icon} color='#fff' size={24} />
              </div>
              <div className="px-3.5 py-[3px] bg-white border border-[#00B2AB]/30 rounded-full z-10">
                <span className="text-[11px] font-semibold text-[#00B2AB] whitespace-nowrap">
                  {t('process.step', { number: step.id })}
                </span>
              </div>
            </div>
            {/* Card */}
            <div className="bg-[#FCFDFD] rounded-[20px] px-6 md:px-8 py-6 md:py-7 w-full max-w-[460px] shadow-[0_4px_30px_rgb(0,0,0,0.03)] border border-slate-50">
              <h3 className="font-semibold text-slate-900 text-[16px] mb-2 text-left">
                {t(`process.step${step.id}.title`)}
              </h3>
              <p className="text-slate-500 text-[13px] leading-relaxed text-left">
                {t(`process.step${step.id}.description`)}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default function HowItWorks() {
  const { ref: headerRef, inView: headerInView } = useInView(0.2);
  const t = useTranslations('Landing');

  return (
    <section id="process" className="w-full bg-white py-24 px-6 overflow-hidden">
      <div className="container mx-auto max-w-[1100px]">
        {/* Header */}
        <div
          ref={headerRef}
          className={`text-center mb-24 transition-all duration-700 ease-out ${
            headerInView
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-6"
          }`}
        >
          <span className="text-sm font-bold text-[#00B2AB] uppercase tracking-wider">
            {t('process.eyebrow')}
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 tracking-tight mt-4">
            {t('process.heading')}
          </h2>
        </div>

        {/* Steps Timeline */}
        <div className="relative flex flex-col gap-6 md:gap-12">
          {/* Vertical line (Desktop: center, Mobile: left) */}
          <div className="absolute left-6 md:left-1/2 top-0 bottom-0 w-[1px] bg-slate-200 -translate-x-1/2 pointer-events-none z-0" />

          {steps.map((step, index) => (
            <StepCard key={step.id} step={step} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
