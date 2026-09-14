"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { BrandLogo } from "@/components/layout/brand-logo";
import { Menu } from "lucide-react";

const navigation = [
  { name: "About", href: "/about" },
  { name: "Roles", href: "/roles" },
  { name: "Webinars", href: "/webinars" },
  { name: "Outreach", href: "/outreach" },
  { name: "Internships", href: "/internships" },
  { name: "Journal", href: "/journal" },
];

export function MarketingHeader() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-ink-200/80 bg-paper/90 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <BrandLogo size="md" />

        <nav className="hidden items-center gap-1 md:flex">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="rounded-md px-3 py-2 text-sm font-medium text-ink-600 transition-colors hover:bg-brand-50 hover:text-brand-800"
            >
              {item.name}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <Link href="/contact">
            <Button variant="ghost" className="text-ink-600 hover:bg-brand-50 hover:text-brand-800">
              Contact
            </Button>
          </Link>
          <Link href="/login">
            <Button className="bg-brand-600 text-white hover:bg-brand-700">Sign in</Button>
          </Link>
        </div>

        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger className="md:hidden">
            <Button variant="ghost" size="icon" className="h-9 w-9" aria-label="Open menu">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-72 bg-paper">
            <nav className="mt-8 flex flex-col gap-2">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className="rounded-md px-3 py-2 text-base font-medium text-ink-800 hover:bg-brand-50"
                >
                  {item.name}
                </Link>
              ))}
              <Link
                href="/contact"
                onClick={() => setIsOpen(false)}
                className="rounded-md px-3 py-2 text-base font-medium text-ink-800 hover:bg-brand-50"
              >
                Contact
              </Link>
              <Link href="/login" onClick={() => setIsOpen(false)} className="mt-4">
                <Button className="w-full bg-brand-600 text-white hover:bg-brand-700">Sign in</Button>
              </Link>
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
