import { AppShell } from "@/components/layout/app-shell";
import { PoweredByAadam } from "@/components/layout/powered-by-aadam";
import { getCurrentProfile } from "@/lib/profile";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const profile = await getCurrentProfile();

  return (
    <div className="flex min-h-full flex-col bg-background pb-20 md:pb-0">
      <AppShell profile={profile} />
      <main className="mx-auto w-full max-w-6xl flex-1 p-4 md:p-6">
        {children}
      </main>
      <PoweredByAadam />
    </div>
  );
}
