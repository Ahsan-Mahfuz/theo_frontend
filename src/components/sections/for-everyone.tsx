import { AppImage } from '@/components/ui/app-image';
import { useTranslations } from 'next-intl';

export const ForEveryone = () => {
  const t = useTranslations('Landing');
  return (
    <section  id='solution' className="w-full py-24 px-6 flex flex-col items-center bg-[#FAFAFA]">
      <div className="text-center mx-auto">
        <span className="text-sm font-bold text-[#00B2AB] uppercase tracking-wider">
          {t('forEveryone.eyebrow')}
        </span>
        <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mt-4 tracking-tight">
          {t('forEveryone.heading')}
        </h2>
      </div>

      {/* Features Grid */}
      <div className="w-full max-w-[1000px] mx-auto mt-16 grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10">

        {/* Host Card */}
        <div className="flex flex-col bg-white rounded-[24px] px-8 pt-10 pb-8 relative overflow-hidden ">
          {/* Top Right Blob (CSS instead of SVG) */}
          <div className="absolute top-0 right-0 pointer-events-none w-[280px] h-[280px] bg-[#E6F3FF]/70 rounded-full -translate-y-[40%] translate-x-[40%]"></div>

          <div className="flex items-center gap-4 relative z-10">
            <div className="size-[48px] rounded-xl flex items-center justify-center">
              <AppImage src={"/airbnb.svg"} alt="airbnb host" width={48} height={48} className='w-full h-full object-contain' />
            </div>
            <div className="w-16 h-[2px] bg-blue-200"></div>
          </div>

          <div className="relative z-10 mt-8">
            <span className='text-sm font-bold text-[#0088FF] uppercase tracking-wide'>{t('forEveryone.host.eyebrow')}</span>
            <h3 className="text-xl font-bold text-slate-900 mt-2">{t('forEveryone.host.title')}</h3>
            <p className="text-[15px] text-slate-500 mt-3 leading-relaxed max-w-[300px]">
              {t('forEveryone.host.description')}
            </p>
          </div>

          <div className="relative z-10 mt-8 space-y-4 mb-10 flex-grow">
            {[
              t('forEveryone.host.item1'),
              t('forEveryone.host.item2'),
              t('forEveryone.host.item3'),
              t('forEveryone.host.item4'),
              t('forEveryone.host.item5'),
              t('forEveryone.host.item6')
            ].map((item, index) => (
              <div key={index} className="flex items-center gap-3">
                <AppImage src={"/check-blue.png"} alt="checkbox" width={20} height={20} className="shrink-0" />
                <span className="text-[15px] text-slate-600">{item}</span>
              </div>
            ))}
          </div>

          <div className="relative z-10 mt-auto bg-[#E6F3FF] rounded-xl py-4 px-4 text-center">
            <span className="text-[14px] font-medium text-[#0088FF]">
              {t('forEveryone.host.footer')}
            </span>
          </div>
        </div>

        {/* Cleaner Card */}
        <div className="flex flex-col bg-white rounded-[24px] px-8 pt-10 pb-8 relative overflow-hidden">
          {/* Top Right Blob (CSS instead of SVG) */}
          <div className="absolute top-0 right-0 pointer-events-none w-[280px] h-[280px] bg-[#EAF7EE]/70 rounded-full -translate-y-[40%] translate-x-[40%]"></div>

          <div className="flex items-center gap-4 relative z-10">
            <div className="size-[48px] rounded-xl flex items-center justify-center">
              <AppImage src={"/cleaner.svg"} alt="cleaner" width={48} height={48} className='w-full h-full object-contain' />
            </div>
            <div className="w-16 h-[2px] bg-green-200"></div>
          </div>

          <div className="relative z-10 mt-8">
            <span className='text-sm font-bold text-[#84D8B3] uppercase tracking-wide'>{t('forEveryone.cleaner.eyebrow')}</span>
            <h3 className="text-xl font-bold text-slate-900 mt-2">{t('forEveryone.cleaner.title')}</h3>
            <p className="text-[15px] text-slate-500 mt-3 leading-relaxed max-w-[300px]">
              {t('forEveryone.cleaner.description')}
            </p>
          </div>

          <div className="relative z-10 mt-8 space-y-4 mb-10 flex-grow">
            {[
              t('forEveryone.cleaner.item1'),
              t('forEveryone.cleaner.item2'),
              t('forEveryone.cleaner.item3'),
              t('forEveryone.cleaner.item4'),
              t('forEveryone.cleaner.item5'),
            ].map((item, index) => (
              <div key={index} className="flex items-center gap-3">
                <AppImage src={"/check-tia.svg"} alt="checkbox" width={20} height={20} className="shrink-0" />
                <span className="text-[15px] text-slate-600">{item}</span>
              </div>
            ))}
          </div>

          <div className="relative z-10 mt-auto bg-[#EAF7EE] rounded-xl py-4 px-4 text-center">
            <span className="text-[14px] font-medium text-[#7DC9A4]">
              {t('forEveryone.cleaner.footer')}
            </span>
          </div>
        </div>

      </div>
    </section>
  );
};

