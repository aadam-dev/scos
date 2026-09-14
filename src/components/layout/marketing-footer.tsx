import Link from "next/link";
import { Separator } from "@/components/ui/separator";
import { PlatformDisclaimer } from "@/components/layout/platform-disclaimer";
import { BrandLogo } from "@/components/layout/brand-logo";

const AADAM_URL = "https://aadambuilds.dev";

const footerLinks = {
  explore: {
    title: "Explore",
    links: [
      { name: "Roles", href: "/roles" },
      { name: "Webinars", href: "/webinars" },
      { name: "Outreach", href: "/outreach" },
      { name: "Internships", href: "/internships" },
      { name: "Journal", href: "/journal" },
    ],
  },
  committee: {
    title: "Committee",
    links: [
      { name: "About", href: "/about" },
      { name: "Features", href: "/features" },
      { name: "Help", href: "/help" },
      { name: "Contact", href: "/contact" },
    ],
  },
  legal: {
    title: "Legal",
    links: [
      { name: "Privacy Policy", href: "/privacy" },
      { name: "Terms of Service", href: "/terms" },
    ],
  },
};

export function MarketingFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative overflow-hidden border-t border-ink-200 bg-ink-950 text-ink-100">
      <div className="pointer-events-none absolute -bottom-16 left-0 select-none text-[18vw] font-bold leading-none tracking-tighter text-white/[0.04]">
        SCOS
      </div>

      <div className="relative mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4 lg:gap-12">
          <div className="col-span-2 md:col-span-1">
            <BrandLogo size="sm" showWordmark={false} tone="dark" />
            <p className="mt-3 text-sm leading-relaxed text-ink-400">
              The Ghana Accra Student Committee workspace for planning, meetings, service hours,
              and continuity across SC generations.
            </p>
          </div>

          {Object.values(footerLinks).map((group) => (
            <div key={group.title}>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-ink-200">
                {group.title}
              </h3>
              <ul className="mt-4 space-y-2.5">
                {group.links.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-sm text-ink-400 transition-colors hover:text-brand-300"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <Separator className="my-8 bg-ink-800" />

        <PlatformDisclaimer className="max-w-3xl text-ink-400" />

        <Separator className="my-8 bg-ink-800" />

        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <p className="text-sm text-ink-500">&copy; {currentYear} SCOS. All rights reserved.</p>
          <p className="flex items-center gap-1.5 text-sm text-ink-500">
            powered by
            <a
              href={AADAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-brand-400 transition-colors hover:text-brand-300 hover:underline"
            >
              aadam
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
