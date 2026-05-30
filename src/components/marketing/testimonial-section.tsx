"use client";

import { Quote } from "lucide-react";

const testimonials = [
  {
    quote:
      "SCOS has transformed how we manage our committee. The structured meeting minutes and automatic activity tracking save us hours every week.",
    author: "Committee Chair",
    role: "Accra Student Committee",
    initials: "AC",
  },
  {
    quote:
      "Finally, a platform built specifically for IOU committees. The Google integration and roster management make onboarding seamless.",
    author: "Secretary",
    role: "Student Committee",
    initials: "SC",
  },
];

export function TestimonialSection() {
  return (
    <section className="bg-white py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mx-auto max-w-2xl text-center mb-16">
          <p className="caption text-clay-700 mb-3">Testimonials</p>
          <h2 className="heading-2 text-ink-900 mb-4">
            Trusted by committees worldwide
          </h2>
          <p className="body-large text-ink-600">
            See what chairs and secretaries are saying about SCOS.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid gap-8 md:grid-cols-2">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="relative rounded-2xl border border-ink-200 bg-ink-50/30 p-8"
            >
              {/* Quote Icon */}
              <div className="mb-6 flex h-10 w-10 items-center justify-center rounded-full bg-clay-100 text-clay-700">
                <Quote className="h-5 w-5" />
              </div>

              {/* Quote */}
              <blockquote className="mb-6 text-lg font-medium text-ink-800 leading-relaxed">
                &ldquo;{testimonial.quote}&rdquo;
              </blockquote>

              {/* Author */}
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-clay-700 text-sm font-semibold text-white">
                  {testimonial.initials}
                </div>
                <div>
                  <p className="text-sm font-semibold text-ink-900">
                    {testimonial.author}
                  </p>
                  <p className="text-xs text-ink-500">{testimonial.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
