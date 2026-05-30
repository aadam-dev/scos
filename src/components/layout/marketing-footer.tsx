import Link from "next/link";
import { Separator } from "@/components/ui/separator";
import { Hexagon, Mail, ExternalLink } from "lucide-react";

const footerLinks = {
  product: {
    title: "Product",
    links: [
      { name: "Features", href: "/features" },
      { name: "For Committees", href: "/committees" },
      { name: "Documentation", href: "/help" },
    ],
  },
  company: {
    title: "Company",
    links: [
      { name: "About", href: "/about" },
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
    <footer className="border-t border-ink-200 bg-white">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4 lg:gap-12">
          {/* Brand Column */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-clay-700 to-clay-600 text-white shadow-sm">
                <Hexagon className="h-4 w-4" strokeWidth={2.5} />
              </div>
              <span className="font-semibold text-ink-900">SCOS</span>
            </Link>
            <p className="mt-3 text-sm leading-relaxed text-ink-500">
              Governance excellence for IOU Student Committees. Streamline operations, track activities, and generate reports.
            </p>
            <div className="mt-4 flex items-center gap-3">
              <a
                href="mailto:aadamsays@gmail.com?subject=SCOS%20Inquiry&body=Hi%20Aadam,%0A%0AI'm%20interested%20in%20learning%20more%20about%20SCOS..."
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-ink-200 text-ink-500 transition-colors hover:border-clay-600 hover:text-clay-700"
                aria-label="Email"
              >
                <Mail className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Product Links */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-ink-900">
              {footerLinks.product.title}
            </h3>
            <ul className="mt-4 space-y-2.5">
              {footerLinks.product.links.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-ink-500 transition-colors hover:text-clay-700"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-ink-900">
              {footerLinks.company.title}
            </h3>
            <ul className="mt-4 space-y-2.5">
              {footerLinks.company.links.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-ink-500 transition-colors hover:text-clay-700"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-ink-900">
              {footerLinks.legal.title}
            </h3>
            <ul className="mt-4 space-y-2.5">
              {footerLinks.legal.links.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-ink-500 transition-colors hover:text-clay-700"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <Separator className="my-8 bg-ink-200" />

        {/* Bottom Row */}
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <p className="text-sm text-ink-500">
            &copy; {currentYear} SCOS. All rights reserved.
          </p>
          <p className="flex items-center gap-1.5 text-sm text-ink-400">
            powered by
            <a
              href="mailto:aadamsays@gmail.com?subject=SCOS%20Inquiry&body=Hi%20Aadam,%0A%0AI'm%20interested%20in%20learning%20more%20about%20SCOS..."
              className="font-medium text-clay-600 transition-colors hover:text-clay-700 hover:underline"
            >
              aadam
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
