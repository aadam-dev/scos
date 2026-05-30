import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | SCOS",
  description:
    "SCOS privacy policy - how we collect, use, and protect your data.",
};

export default function PrivacyPage() {
  return (
    <div className="bg-white">
      <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
        <p className="caption text-clay-700 mb-4">Legal</p>
        <h1 className="heading-1 text-ink-900 mb-8">Privacy Policy</h1>

        <div className="prose prose-ink max-w-none">
          <p className="body-large text-ink-600 mb-8">
            Last updated: {new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" })}
          </p>

          <section className="mb-8">
            <h2 className="heading-3 text-ink-900 mb-3">1. Introduction</h2>
            <p className="text-ink-600 leading-relaxed">
              SCOS (&ldquo;we,&rdquo; &ldquo;our,&rdquo; or &ldquo;us&rdquo;) is committed to protecting your privacy.
              This Privacy Policy explains how we collect, use, disclose, and safeguard your
              information when you use our Student Committee Operating System platform.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="heading-3 text-ink-900 mb-3">2. Information We Collect</h2>
            <p className="text-ink-600 leading-relaxed mb-3">
              We collect the following types of information:
            </p>
            <ul className="list-disc pl-5 space-y-2 text-ink-600">
              <li>
                <strong>Account Information:</strong> Name, email address, and Google account
                information when you sign in.
              </li>
              <li>
                <strong>Committee Data:</strong> Meeting records, attendance, activity logs,
                and planning information you create.
              </li>
              <li>
                <strong>Uploaded Content:</strong> Photos, documents, and evidence files
                uploaded for activity verification.
              </li>
              <li>
                <strong>Usage Data:</strong> How you interact with the platform, including
                access logs and feature usage.
              </li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="heading-3 text-ink-900 mb-3">3. How We Use Your Information</h2>
            <p className="text-ink-600 leading-relaxed mb-3">
              We use your information to:
            </p>
            <ul className="list-disc pl-5 space-y-2 text-ink-600">
              <li>Provide and maintain the SCOS platform</li>
              <li>Generate reports and analytics for your committee</li>
              <li>Send notifications and reminders related to your committee work</li>
              <li>Improve our services and user experience</li>
              <li>Comply with legal obligations</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="heading-3 text-ink-900 mb-3">4. Data Security</h2>
            <p className="text-ink-600 leading-relaxed">
              We implement appropriate technical and organizational measures to protect your
              data, including encryption at rest and in transit, Row-Level Security (RLS)
              in our database, and secure authentication via Google OAuth. However, no
              method of transmission over the internet is 100% secure.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="heading-3 text-ink-900 mb-3">5. Data Sharing</h2>
            <p className="text-ink-600 leading-relaxed">
              We do not sell your personal information. Committee data is shared only with:
              (a) other members of your own committee based on their role permissions,
              (b) IOU officials when official reports are submitted, and (c) service
              providers necessary for platform operation (e.g., Supabase, Google).
            </p>
          </section>

          <section className="mb-8">
            <h2 className="heading-3 text-ink-900 mb-3">6. Your Rights</h2>
            <p className="text-ink-600 leading-relaxed">
              You have the right to access, correct, or delete your personal information.
              Contact your committee administrator or email us at the address below to
              exercise these rights.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="heading-3 text-ink-900 mb-3">7. Contact Us</h2>
            <p className="text-ink-600 leading-relaxed">
              If you have questions about this Privacy Policy, please contact us at:{" "}
              <a
                href="mailto:aadamsays@gmail.com"
                className="text-clay-700 hover:underline"
              >
                aadamsays@gmail.com
              </a>
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
