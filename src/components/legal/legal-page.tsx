'use client';

import { useTranslations } from 'next-intl';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { useGetContentQuery, type ContentType } from '@/store/api/contentApi';

interface LegalPageProps {
  /** Backend content type served from `/content/{type}`. */
  type: ContentType;
  /** i18n key under `Landing.legalPages` for this page (e.g. `about`). */
  pageKey: 'about' | 'privacy' | 'terms' | 'legalNotice';
}

export function LegalPage({ type, pageKey }: LegalPageProps) {
  const t = useTranslations('Landing.legalPages');
  const { data, isLoading } = useGetContentQuery(type);
  const html = typeof data?.content === 'string' ? data.content.trim() : '';

  return (
    <div className="flex flex-col h-screen overflow-y-auto bg-white">
      <Header />
      <main className="flex-1 pt-24">
        {/* Hero */}
        <section className="w-full bg-gradient-to-b from-[#F5F9FF] to-white border-b border-slate-900/5">
          <div className="container mx-auto px-6 md:px-12 py-14 md:py-20">
            <p className="text-[13px] font-bold tracking-widest uppercase text-[#0088FF] mb-3">
              {t('eyebrow')}
            </p>
            <h1 className="text-3xl md:text-5xl font-bold text-slate-900 tracking-tight">
              {t(`${pageKey}.title`)}
            </h1>
            <p className="mt-4 text-[15px] md:text-lg text-slate-500 max-w-2xl leading-relaxed">
              {t(`${pageKey}.subtitle`)}
            </p>
          </div>
        </section>

        {/* Content */}
        <section className="container mx-auto px-6 md:px-12 py-12 md:py-16">
          <div className="max-w-3xl">
            {isLoading ? (
              <div className="flex flex-col gap-4 animate-pulse">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div
                    key={i}
                    className="h-4 rounded bg-slate-100"
                    style={{ width: `${[95, 80, 88, 70, 92, 60][i]}%` }}
                  />
                ))}
              </div>
            ) : html ? (
              <div
                className="text-[15px] text-slate-600 leading-relaxed
                  [&_h1]:text-slate-900 [&_h1]:font-bold [&_h1]:text-2xl [&_h1]:mt-8 [&_h1]:mb-4
                  [&_h2]:text-slate-900 [&_h2]:font-bold [&_h2]:text-xl [&_h2]:mt-8 [&_h2]:mb-3
                  [&_h3]:text-slate-900 [&_h3]:font-semibold [&_h3]:text-lg [&_h3]:mt-6 [&_h3]:mb-2
                  [&_p]:mb-4
                  [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:mb-4 [&_ul]:flex [&_ul]:flex-col [&_ul]:gap-2
                  [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:mb-4 [&_ol]:flex [&_ol]:flex-col [&_ol]:gap-2
                  [&_a]:text-[#0088FF] [&_a]:underline [&_a]:underline-offset-2
                  [&_strong]:text-slate-900 [&_strong]:font-semibold
                  [&_hr]:my-8 [&_hr]:border-slate-900/10"
                dangerouslySetInnerHTML={{ __html: html }}
              />
            ) : (
              <div className="rounded-2xl border border-slate-100 bg-[#FAFAFA] p-8 text-center">
                <p className="text-[15px] text-slate-500">{t('empty')}</p>
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
