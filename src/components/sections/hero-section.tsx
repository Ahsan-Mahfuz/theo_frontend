import { AppImage } from '@/components/ui/app-image';
import { Button } from '../ui/button';
import { useTranslations } from 'next-intl';

export default function HeroSection() {
  const t = useTranslations('Landing');
  return (
    <section className='min-h-screen w-full relative pt-24 pb-12 flex items-center justify-center overflow-hidden'>
      {/* Background gradients */}
      <div
        className="absolute inset-0 z-0 pointer-events-none"
        style={{
          backgroundImage: `
            radial-gradient(circle at 20% 60%, rgba(135, 206, 250, 0.25), transparent 45%),
            radial-gradient(circle at 80% 40%, rgba(155, 227, 191, 0.3), transparent 45%)
          `,
        }}
      />
      <main className="container mx-auto px-6 md:px-12 relative z-10 flex flex-col md:flex-row items-center justify-between gap-16 md:gap-12 mt-10 md:mt-0">
        <div className="flex flex-col items-center md:items-start flex-1 text-center md:text-left pt-12 md:pt-0">
          <h1 className="text-[2.75rem] leading-[1.1] md:text-6xl lg:text-[4.5rem] lg:leading-[1.1] font-extrabold text-slate-900 tracking-tight">
            {t('hero.titlePart1')} <br className="hidden lg:block" />
            <span className='text-[#0088FF]'>{t('hero.automate')}</span> {t('hero.your')} <br className="hidden lg:block" />
            {t('hero.airbnb')} <span className='text-[#84D8B3]'>{t('hero.cleaning')}</span>
          </h1>
          <p className="text-[17px] leading-relaxed text-slate-600 max-w-[540px] mt-6 font-medium">
            {t('hero.subtitle')}
          </p>
          <div className="mt-10">
            <Button className="bg-[#0088FF] hover:bg-[#0077E6] text-white rounded-[10px] px-8 h-12 text-[15px] font-semibold shadow-[0_4px_14px_0_rgba(0,136,255,0.39)] transition-all active:scale-95">
              {t('hero.cta')}
            </Button>
          </div>
        </div>
        
        <div className="flex-1 flex justify-center md:justify-end items-center relative w-full h-[500px] md:h-[650px] lg:h-[750px]">
          <div className="relative w-full h-full max-w-[320px] md:max-w-[400px] flex items-center justify-center">
             <AppImage
               src="/gestlio.svg"
               alt="Gestlio App Mockup"
               fill
               className="object-contain drop-shadow-2xl"
               priority
             />
          </div>
        </div>
      </main>
    </section>
  );
}