import { Calendar04Icon, CreditCardIcon, FlashIcon, Invoice02Icon, RepeatIcon, Search02Icon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import { useTranslations } from 'next-intl'

export const Features = () => {
  const t = useTranslations('Landing')
  const features = [
    {
      icon: <HugeiconsIcon icon={Calendar04Icon} color="#fff" size={24} />,
      title: t('features.icalSync.title'),
      description: t('features.icalSync.description'),
    },
    {
      icon: <HugeiconsIcon icon={Search02Icon} color="#fff" size={24} />,
      title: t('features.marketplace.title'),
      description: t('features.marketplace.description'),
    },
    {
      icon: <HugeiconsIcon icon={FlashIcon} color="#fff" size={24} />,
      title: t('features.smartAssignment.title'),
      description: t('features.smartAssignment.description'),
    },
    {
      icon: <HugeiconsIcon icon={CreditCardIcon} color="#fff" size={24} />,
      title: t('features.payments.title'),
      description: t('features.payments.description'),
    },
    {
      icon: <HugeiconsIcon icon={Invoice02Icon} color="#fff" size={24} />,
      title: t('features.invoices.title'),
      description: t('features.invoices.description'),
    },
    {
      icon: <HugeiconsIcon icon={RepeatIcon} color="#fff" size={24} />,
      title: t('features.tracking.title'),
      description: t('features.tracking.description'),
    }
  ]

  return (
    <section id='features' className="w-full bg-[#FAFAFA] py-24 px-6">
      <div className="container mx-auto max-w-[1100px] flex flex-col items-center">
        {/* Header */}
        <div className="text-center mb-16 md:mb-16">
          <span className="text-sm font-bold text-[#00B2AB] uppercase tracking-wider">
            {t('features.eyebrow')}
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 tracking-tight mt-4 max-w-5xl mx-auto leading-tight">
            {t('features.headingLine1')}<br className="hidden md:block" /> {t('features.headingLine2')}
          </h2>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 w-full">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white rounded-[24px] p-8 shadow-[0_4px_30px_rgb(0,0,0,0.03)] transition-transform hover:-translate-y-1 flex flex-col items-start border border-slate-50"
            >
              <div className="w-12 h-12 rounded-xl bg-[#00B2AB] flex items-center justify-center shadow-lg shadow-[#00B2AB]/20 mb-6 shrink-0">
                {feature.icon}
              </div>
              <h3 className="font-semibold text-slate-900 text-[16px] mb-3">
                {feature.title}
              </h3>
              <p className="text-slate-500 text-[13px] leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}