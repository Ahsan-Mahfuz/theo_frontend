import { MessageDelay01Icon, PromotionIcon, Time04Icon, UserGroupIcon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { useTranslations } from 'next-intl';

export default function SolutionSection() {
  const t = useTranslations('Landing');
  const featuresData = [
    {
      icon: <HugeiconsIcon icon={MessageDelay01Icon} color='white' size={20} />,
      title: t('solution.fewerMessages.title'),
      description: t('solution.fewerMessages.description')
    },
    {
      icon: <HugeiconsIcon icon={Time04Icon} color='white' size={20} />,
      title: t('solution.fewerErrors.title'),
      description: t('solution.fewerErrors.description')
    },
    {
      icon: <HugeiconsIcon icon={PromotionIcon} color='white' size={20} />,
      title: t('solution.lessStress.title'),
      description: t('solution.lessStress.description')
    },
    {
      icon: <HugeiconsIcon icon={UserGroupIcon} color='white' size={20} />,
      title: t('solution.centralized.title'),
      description: t('solution.centralized.description')
    }
  ];
  return (
    <section className="py-24 px-6 bg-[#1F2937]">
      <div className="container mx-auto max-w-[1200px] flex flex-col items-center">
        {/* Header */}
        <div className="text-center mb-16 md:mb-20">
          <span className="text-sm font-bold text-[#00B2AB] uppercase tracking-wider">
            {t('solution.eyebrow')}
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-white tracking-tight mt-4 max-w-3xl mx-auto leading-tight">
            {t('solution.heading')}
          </h2>
        </div>

        {/* Cards Grid */}
        <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuresData.map((feature, index) => (
            <div 
              key={index} 
              className="bg-white rounded-[20px] p-6 shadow-lg transition-transform hover:-translate-y-1"
            >
              <div className="w-10 h-10 rounded-xl bg-[#00B2AB] flex items-center justify-center mb-6">
                {feature.icon}
              </div>
              <h3 className="font-semibold text-slate-900 text-[15px] mb-3">
                {feature.title}
              </h3>
              <p className="text-slate-500 text-[13px] leading-relaxed whitespace-pre-line">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};


