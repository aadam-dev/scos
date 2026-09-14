import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service | SCOS",
  description:
    "SCOS terms of service - the agreement between you and SCOS for using the platform.",
};

export default function TermsPage() {
  return (
    <div className="bg-white">
      <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
        <p className="caption text-brand-700 mb-4">Legal</p>
        <h1 className="heading-1 text-ink-900 mb-8">Terms of Service</h1>

        <div className="prose prose-ink max-w-none">
          <p className="body-large text-ink-600 mb-8">
            Last updated: {new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" })}
          </p>

          <section className="mb-8">
            <h2 className="heading-3 text-ink-900 mb-3">1. Acceptance of Terms</h2>
            <p className="text-ink-600 leading-relaxed">
              By accessing or using SCOS (the &ldquo;Platform&rdquo;), you agree to be bound by these
              Terms of Service. If you do not agree to these terms, please do not use the Platform.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="heading-3 text-ink-900 mb-3">2. Description of Service</h2>
            <p className="text-ink-600 leading-relaxed mb-4">
              SCOS is a Student Committee Operating System designed to help student committees
              manage meetings, track activities, and generate reports. The Platform is provided
              as-is and may be updated or modified at any time.
            </p>
            <p className="text-ink-600 leading-relaxed">
              SCOS is an independent project and is not affiliated with, endorsed by, or
              operated by International Open University (IOU). It was initially developed by IT
              support for the Ghana Accra Student Committee. Use of the Platform does not imply
              IOU approval of committee operations or recorded service hours.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="heading-3 text-ink-900 mb-3">3. User Accounts</h2>
            <p className="text-ink-600 leading-relaxed mb-3">
              To use SCOS, you must:
            </p>
            <ul className="list-disc pl-5 space-y-2 text-ink-600">
              <li>Be a current or prospective member of an IOU Student Committee</li>
              <li>Provide accurate and complete information when creating an account</li>
              <li>Maintain the security of your account credentials</li>
              <li>Notify your committee administrator of any unauthorized access</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="heading-3 text-ink-900 mb-3">4. Acceptable Use</h2>
            <p className="text-ink-600 leading-relaxed mb-3">
              You agree not to:
            </p>
            <ul className="list-disc pl-5 space-y-2 text-ink-600">
              <li>Use the Platform for any illegal or unauthorized purpose</li>
              <li>Upload false or misleading information, including fabricated activity logs</li>
              <li>Attempt to access data belonging to other committees or members without authorization</li>
              <li>Interfere with or disrupt the Platform&apos;s servers or networks</li>
              <li>Reverse engineer or attempt to extract the source code of the Platform</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="heading-3 text-ink-900 mb-3">5. Content and Data</h2>
            <p className="text-ink-600 leading-relaxed">
              You retain ownership of content you upload to SCOS. By uploading content, you
              grant SCOS a license to use, store, and process that content for the purpose of
              providing the Platform services. Committee data is shared within your committee
              according to role-based permissions.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="heading-3 text-ink-900 mb-3">6. Termination</h2>
            <p className="text-ink-600 leading-relaxed">
              We may suspend or terminate your access to the Platform at any time, with or without
              cause, with or without notice. Upon termination, your right to use the Platform
              will immediately cease.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="heading-3 text-ink-900 mb-3">7. Disclaimer of Warranties</h2>
            <p className="text-ink-600 leading-relaxed">
              THE PLATFORM IS PROVIDED &ldquo;AS IS&rdquo; WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS
              OR IMPLIED. WE DO NOT WARRANT THAT THE PLATFORM WILL BE UNINTERRUPTED, SECURE,
              OR ERROR-FREE.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="heading-3 text-ink-900 mb-3">8. Limitation of Liability</h2>
            <p className="text-ink-600 leading-relaxed">
              IN NO EVENT SHALL SCOS BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL,
              CONSEQUENTIAL, OR PUNITIVE DAMAGES ARISING OUT OF OR RELATED TO YOUR USE OF
              THE PLATFORM.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="heading-3 text-ink-900 mb-3">9. Changes to Terms</h2>
            <p className="text-ink-600 leading-relaxed">
              We reserve the right to modify these Terms at any time. We will notify users
              of significant changes. Your continued use of the Platform after changes
              constitutes acceptance of the new Terms.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="heading-3 text-ink-900 mb-3">10. Contact Information</h2>
            <p className="text-ink-600 leading-relaxed">
              For questions about these Terms, please contact us at:{" "}
              <a
                href="mailto:aadamsays@gmail.com"
                className="text-brand-700 hover:underline"
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
