import type { Metadata } from "next";
import { Mail, MessageSquare, ExternalLink } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Contact | SCOS",
  description:
    "Get in touch with SCOS for support, inquiries, or partnership opportunities.",
};

const contactMethods = [
  {
    icon: Mail,
    title: "Email",
    description: "For general inquiries and support requests",
    action: "Send Email",
    href: "mailto:aadamsays@gmail.com?subject=SCOS%20Inquiry&body=Hi%20Aadam,%0A%0AI'm%20interested%20in%20learning%20more%20about%20SCOS...",
  },
  {
    icon: MessageSquare,
    title: "Support",
    description: "For technical issues and platform help",
    action: "Get Help",
    href: "/help",
  },
];

const faqs = [
  {
    question: "How do I get access to SCOS?",
    answer:
      "SCOS is currently available to IOU Student Committee members. Contact your committee chair or secretary to be added to the roster. Once added, you can sign in with your Google account.",
  },
  {
    question: "Can my committee use SCOS?",
    answer:
      "We are expanding to support more committees. Contact us to discuss onboarding your Student Committee onto the platform.",
  },
  {
    question: "Is SCOS free to use?",
    answer:
      "SCOS is currently provided at no cost to IOU Student Committees. We may introduce paid tiers for advanced features in the future.",
  },
  {
    question: "How is my data protected?",
    answer:
      "SCOS uses Supabase with Row-Level Security (RLS) to ensure your data is protected. Members can only see their own data and committee-wide aggregated information appropriate to their role.",
  },
];

export default function ContactPage() {
  return (
    <div className="bg-white">
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-ink-200">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-brand-100/50 via-transparent to-transparent" />
        <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <p className="caption text-brand-700 mb-4">Contact</p>
            <h1 className="heading-1 text-ink-900 mb-6">
              Get in touch
            </h1>
            <p className="body-large text-ink-600">
              Have questions about SCOS? Want to bring your committee on board?
              We&apos;re here to help.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Methods */}
      <section className="py-16 lg:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-6 md:grid-cols-2 max-w-3xl mx-auto">
            {contactMethods.map((method) => (
              <Card
                key={method.title}
                className="border-ink-200 bg-ink-50/30 transition-all hover:border-brand-300"
              >
                <CardContent className="pt-6">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-brand-700 to-brand-600 text-white">
                    <method.icon className="h-6 w-6" strokeWidth={1.5} />
                  </div>
                  <h3 className="heading-3 text-ink-900 mb-2">{method.title}</h3>
                  <p className="body-small text-ink-600 mb-4">{method.description}</p>
                  <a
                    href={method.href}
                    className="inline-flex items-center justify-center rounded-md border border-brand-300 bg-white px-4 py-2 text-sm font-medium text-brand-700 transition-colors hover:bg-brand-50"
                  >
                    {method.action}
                    <ExternalLink className="ml-2 h-4 w-4" />
                  </a>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section className="border-t border-ink-200 bg-ink-50/50 py-16 lg:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl">
            <div className="text-center mb-12">
              <p className="caption text-brand-700 mb-4">FAQ</p>
              <h2 className="heading-2 text-ink-900">
                Frequently asked questions
              </h2>
            </div>

            <div className="space-y-6">
              {faqs.map((faq) => (
                <div
                  key={faq.question}
                  className="rounded-xl border border-ink-200 bg-white p-6"
                >
                  <h3 className="heading-4 text-ink-900 mb-3">{faq.question}</h3>
                  <p className="body-small text-ink-600">{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
