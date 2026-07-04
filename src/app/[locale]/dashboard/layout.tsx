import { DashboardHeader } from '@/components/dashboard/header';
import { DashboardFooter } from '@/components/dashboard/footer';
import { AuthGuard } from '@/components/dashboard/AuthGuard';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGuard>
      <div className="min-h-screen bg-[#FAFAFA] font-sans flex flex-col">
        <DashboardHeader />
        <div className="flex-1 max-w-[1440px] mx-auto w-full">
          {children}
        </div>
        <DashboardFooter />
      </div>
    </AuthGuard>
  );
}
