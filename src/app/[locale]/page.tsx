import { Features } from '@/components/sections/features';
import { ForEveryone } from '@/components/sections/for-everyone';
import HeroSection from '@/components/sections/hero-section';
import HowItWorks from '@/components/sections/how-it-work';
import SolutionSection from '@/components/sections/solution';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { DownloadCTA } from '@/components/sections/download-cta';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1">
        <HeroSection />
        <ForEveryone />
        <HowItWorks />
        <Features />
        <SolutionSection />
        <DownloadCTA />
      </main>
      <Footer />
    </div>
  );
}