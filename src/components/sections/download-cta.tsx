import { AppImage } from "@/components/ui/app-image";
import { useTranslations } from "next-intl";

export function DownloadCTA() {
  const t = useTranslations('Landing');
  return (
    <section id="downloadapp" className="w-full bg-white py-16 px-6 overflow-hidden">
      <div className="container mx-auto max-w-[1100px] flex flex-col items-center">
        {/* Blue Banner */}
        <div className="w-full bg-[#0088FF] rounded-[32px] relative flex flex-col md:flex-row items-center justify-between px-8 md:px-16 pt-12 md:pt-0 mt-16 mb-8">
          {/* Left Text */}
          <div className="text-left w-full md:w-1/2 py-12 md:py-20 relative z-10">
            <h2 className="text-3xl md:text-[36px] font-bold text-white mb-3 leading-tight">
              {t('download.title')}
            </h2>
            <p className="text-white/90 text-[14px] leading-relaxed mb-8 max-w-[340px]">
              {t('download.description')}
            </p>
            <div className="flex flex-col sm:flex-row items-center gap-3">
              <button className="w-full sm:w-auto bg-white text-slate-900 hover:bg-slate-50 transition-colors rounded-lg px-5 h-11 flex items-center justify-center gap-2.5 font-semibold text-[13px] shadow-sm">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M21.8055 10.0415H21V10H12V14H17.6515C16.827 16.3285 14.6115 18 12 18C8.6865 18 6 15.3135 6 12C6 8.6865 8.6865 6 12 6C13.5295 6 14.921 6.577 15.9805 7.5195L18.809 4.691C17.023 3.0265 14.634 2 12 2C6.4775 2 2 6.4775 2 12C2 17.5225 6.4775 22 12 22C17.5225 22 22 17.5225 22 12C22 11.3295 21.931 10.675 21.8055 10.0415Z"
                    fill="#FFC107"
                  />
                  <path
                    d="M3.15332 7.3455L6.43882 9.755C7.32782 7.554 9.48082 6 12.0003 6C13.5298 6 14.9213 6.577 15.9808 7.5195L18.8093 4.691C17.0233 3.0265 14.6343 2 12.0003 2C8.15932 2 4.82832 4.1685 3.15332 7.3455Z"
                    fill="#FF3D00"
                  />
                  <path
                    d="M12.0002 21.9999C14.5832 21.9999 16.9302 21.0114 18.7047 19.4039L15.6097 16.7849C14.6057 17.5454 13.3577 17.9999 12.0002 17.9999C9.39916 17.9999 7.19066 16.3414 6.35866 14.0269L3.09766 16.5394C4.75266 19.7779 8.11366 21.9999 12.0002 21.9999Z"
                    fill="#4CAF50"
                  />
                  <path
                    d="M21.8055 10.0415H21V10H12V14H17.6515C17.2555 15.1185 16.536 16.083 15.608 16.7855L15.6095 16.7845L18.7045 19.4035C18.4855 19.6025 22 17 22 12C22 11.3295 21.931 10.675 21.8055 10.0415Z"
                    fill="#1976D2"
                  />
                </svg>
                {t('download.googlePlay')}
              </button>
              <button className="w-full sm:w-auto bg-white text-slate-900 hover:bg-slate-50 transition-colors rounded-lg px-5 h-11 flex items-center justify-center gap-2.5 font-semibold text-[13px] shadow-sm">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M20.4523 7.82787C20.3539 7.88947 18.0115 9.18947 18.0115 12.0719C18.1219 15.3591 20.9675 16.5119 21.0163 16.5119C20.9675 16.5735 20.5867 18.0823 19.4587 19.6639C18.5635 21.0263 17.5699 22.3999 16.0611 22.3999C14.6259 22.3999 14.1107 21.4919 12.4547 21.4919C10.6763 21.4919 10.1731 22.3999 8.81153 22.3999C7.30273 22.3999 6.23553 20.9527 5.29153 19.6031C4.06513 17.8367 3.02273 15.0647 2.98593 12.4031C2.96113 10.9927 3.23153 9.60627 3.91793 8.42867C4.88673 6.78467 6.61633 5.66867 8.50513 5.63187C9.95233 5.58307 11.2403 6.62547 12.1235 6.62547C12.9699 6.62547 14.5523 5.63187 16.3427 5.63187C17.1155 5.63267 19.1763 5.86547 20.4523 7.82787ZM12.0011 5.35027C11.7435 4.06227 12.4547 2.77427 13.1171 1.95267C13.9635 0.959068 15.3003 0.284668 16.4531 0.284668C16.5267 1.57267 16.0603 2.83587 15.2267 3.75587C14.4787 4.74947 13.1907 5.49747 12.0011 5.35027Z"
                    fill="black"
                  />
                </svg>
                {t('download.appStore')}
              </button>
            </div>
          </div>

          {/* Right Image */}
          <div className="w-full md:w-1/2 flex justify-center md:absolute md:right-26 md:-top-24 md:-bottom-0 pointer-events-none z-0">
            <div className="w-full h-[400px] md:h-full flex items-center justify-center md:justify-end">
              <AppImage
                src="/downloadcta.png"
                alt="Download App"
                width={500}
                height={700}
                className="object-contain object-right h-full w-auto"
              />
            </div>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="mt-24 text-center flex flex-col items-center">
          <h2 className="text-3xl md:text-[32px] font-bold text-slate-900 mb-3">
            {t('download.bottomTitle')}
          </h2>
          <p className="text-slate-500 text-[16px] mb-8">
            {t('download.bottomSubtitle')}
          </p>
          <button className="bg-[#0088FF] hover:bg-[#0077E6] transition-colors text-white rounded-xl px-8 h-12 font-semibold text-[15px]">
            {t('download.bottomCta')}
          </button>
        </div>
      </div>
    </section>
  );
}
