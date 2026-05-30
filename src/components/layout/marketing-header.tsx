"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, X, Hexagon } from "lucide-react";

const navigation = [
  { name: "About", href: "/about" },
  { name: "Features", href: "/features" },
  { name: "Committees", href: "/committees" },
  { name: "Help", href: "/help" },
];

export function MarketingHeader() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-ink-200/80 bg-white/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 transition-opacity hover:opacity-80">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-clay-700 to-clay-600 text-white shadow-sm">
            <Hexagon className="h-5 w-5" strokeWidth={2.5} />
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-medium uppercase tracking-[0.15em] text-ink-500">
              International Open University
            </span>
            <span className="text-sm font-semibold tracking-tight text-ink-900">
              SCOS
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="px-4 py-2 text-sm font-medium text-ink-600 transition-colors hover:text-ink-900"
            >
              {item.name}
            </Link>
          ))}
        </nav>

        {/* Desktop CTA */}
        <div className="hidden md:flex items-center gap-3">
          <Link href="/contact">
            <Button variant="ghost" className="text-ink-600 hover:text-ink-900 hover:bg-ink-100">
              Contact
            </Button>
          </Link>
          <Link href="/login">
            <Button className="bg-clay-700 text-white hover:bg-clay-800 shadow-sm">
              Access Platform
            </Button>
          </Link>
        </div>

        {/* Mobile Menu */}
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger className="md:hidden">
            <Button variant="ghost" size="icon" className="h-9 w-9">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Open menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[300px] bg-white">
            <div className="flex flex-col gap-6 pt-6">
              {/* Mobile Logo */}
              <Link href="/" className="flex items-center gap-2.5" onClick={() => setIsOpen(false)}>
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-clay-700 to-clay-600 text-white">
                  <Hexagon className="h-4 w-4" strokeWidth={2.5} />
                </div>
                <span className="font-semibold text-ink-900">SCOS</span>
              </Link>

              {/* Mobile Navigation */}
              <nav className="flex flex-col gap-1">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    className="rounded-lg px-3 py-2.5 text-sm font-medium text-ink-600 transition-colors hover:bg-ink-50 hover:text-ink-900"
                  >
                    {item.name}
                  </Link>
                ))}
                <Link
                  href="/contact"
                  onClick={() => setIsOpen(false)}
                  className="rounded-lg px-3 py-2.5 text-sm font-medium text-ink-600 transition-colors hover:bg-ink-50 hover:text-ink-900"
                >
                  Contact
                </Link>
              </nav>

              {/* Mobile CTA */}
              <div className="border-t border-ink-200 pt-4">
                <Link href="/login" onClick={() => setIsOpen(false)}>
                  <Button className="w-full bg-clay-700 text-white hover:bg-clay-800">
                    Access Platform
                  </Button>
                </Link>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
