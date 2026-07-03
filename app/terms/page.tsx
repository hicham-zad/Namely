import type { Metadata } from "next";
import Link from "next/link";
import JsonLd from "@/components/layout/JsonLd";
import type { BreadcrumbList, WithContext } from "schema-dts";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "Namely Terms of Service and End User License Agreement. Covers subscriptions, cancellation, refunds, acceptable use, and governing law (Wyoming).",
  alternates: { canonical: "https://matchbabynames.com/terms" },
  openGraph: { title: "Terms of Service | Namely", url: "https://matchbabynames.com/terms" },
};

const breadcrumb: WithContext<BreadcrumbList> = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: "https://matchbabynames.com" },
    { "@type": "ListItem", position: 2, name: "Terms of Service", item: "https://matchbabynames.com/terms" },
  ],
};

const EFFECTIVE_DATE = "1 July 2025";
const CONTACT_EMAIL = "support@matchbabynames.com";

export default function TermsPage() {
  return (
    <>
      <JsonLd data={breadcrumb} />

      <div className="bg-white text-slate-800 py-14">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <nav aria-label="Breadcrumb" className="text-sm text-slate-800/60 mb-3">
            <ol className="flex items-center gap-2">
              <li><Link href="/" className="hover:text-slate-800 transition-colors">Home</Link></li>
              <li aria-hidden="true">›</li>
              <li className="text-slate-800/90">Terms of Service</li>
            </ol>
          </nav>
          <h1 className="text-3xl md:text-4xl font-extrabold" style={{ fontFamily: "var(--font-outfit)" }}>Terms of Service</h1>
          <p className="mt-3 text-slate-800/75">Effective date: {EFFECTIVE_DATE}</p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-14 prose-legal">
        <p>
          These Terms of Service (&ldquo;Terms&rdquo;) constitute a legally binding agreement between you and <strong>Namely LLC</strong>, a Wyoming limited liability company (&ldquo;Namely&rdquo;, &ldquo;we&rdquo;, &ldquo;us&rdquo;, or &ldquo;our&rdquo;), governing your use of the Namely mobile application and website at matchbabynames.com (collectively, the &ldquo;Service&rdquo;).
        </p>
        <p>By creating an account or using the Service, you agree to these Terms. If you do not agree, do not use the Service.</p>

        <h2>1. Acceptance of Terms</h2>
        <p>
          You must be at least 18 years old to use the Service. By using Namely, you represent that you are 18 or older and have the legal capacity to enter into a binding agreement. These Terms incorporate our <Link href="/privacy">Privacy Policy</Link> by reference.
        </p>

        <h2>2. Description of Service</h2>
        <p>
          Namely is a baby name discovery application that allows two partnered users to independently swipe through a curated and AI-generated list of baby names. A match is flagged and shown to both users only when both have independently liked the same name. Features include AI-powered name generation, real-time partner sync, and match notifications.
        </p>

        <h2>3. Account Registration</h2>
        <p>
          You must create an account to use Namely. You agree to provide accurate and current information during registration and to keep your account credentials secure. You are responsible for all activity under your account. Notify us immediately at <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a> if you suspect unauthorised access.
        </p>
        <p>
          You may link your account with one partner account using a shared invite code. Each Namely account may be linked to one partner account at a time.
        </p>

        <h2>4. Subscription &amp; Billing</h2>

        <h3>Free Trial</h3>
        <p>
          Namely offers a <strong>3-day free trial</strong> for new subscribers. Your free trial begins when you start your subscription. If you cancel before the trial ends, you will not be charged.
        </p>

        <h3>Subscription Price</h3>
        <p>
          After the free trial, the subscription is billed at <strong>$6.99 per week</strong> (or the equivalent price in your local currency as displayed in the App Store or Google Play at the time of purchase).
        </p>

        <h3>Auto-Renewal</h3>
        <p>
          Your subscription automatically renews at the end of each billing period unless you cancel at least 24 hours before the renewal date. Renewal charges are processed through your App Store or Google Play account.
        </p>

        <h3>Price Changes</h3>
        <p>
          We may change the subscription price at any time. If we change the price, we will provide reasonable notice. Continued use after a price change constitutes acceptance of the new price.
        </p>

        <h2>5. Cancellation &amp; Refunds</h2>

        <h3>How to Cancel</h3>
        <p>
          You can cancel your Namely subscription at any time through your device&rsquo;s subscription management settings:
        </p>
        <ul>
          <li><strong>iOS</strong>: Settings → [Your Name] → Subscriptions → Namely → Cancel Subscription</li>
          <li><strong>Android</strong>: Google Play → Profile → Payments & subscriptions → Subscriptions → Namely → Cancel</li>
        </ul>
        <p>
          Cancellation takes effect at the end of the current billing period. You retain access to paid features until then.
        </p>

        <h3>Refunds</h3>
        <p>
          All subscription purchases are processed by Apple (App Store) or Google (Google Play). Refund requests must be made directly to Apple or Google in accordance with their respective refund policies. Namely does not issue refunds directly.
        </p>
        <ul>
          <li><a href="https://support.apple.com/en-us/118223" target="_blank" rel="noopener noreferrer">Request a refund from Apple →</a></li>
          <li><a href="https://support.google.com/googleplay/answer/2479637" target="_blank" rel="noopener noreferrer">Request a refund from Google →</a></li>
        </ul>

        <h2>6. Acceptable Use</h2>
        <p>You agree not to:</p>
        <ul>
          <li>Use the Service for any unlawful purpose or in violation of these Terms.</li>
          <li>Attempt to reverse-engineer, decompile, or extract the source code of the App.</li>
          <li>Use automated tools (bots, scrapers) to access or manipulate the Service.</li>
          <li>Share your account credentials with third parties.</li>
          <li>Attempt to disrupt, overload, or damage the Service or its infrastructure.</li>
          <li>Submit false, misleading, or harmful content through any feature of the Service.</li>
        </ul>
        <p>
          We reserve the right to suspend or terminate accounts that violate these Terms without notice or refund.
        </p>

        <h2>7. User Content &amp; Intellectual Property</h2>
        <p>
          The Service and all content created by Namely (including AI-generated name suggestions, UI design, and underlying technology) are owned by Namely LLC and are protected by copyright, trademark, and other intellectual property laws.
        </p>
        <p>
          You retain ownership of any content you submit (e.g., preferences, notes). By submitting content, you grant Namely a limited, worldwide, royalty-free licence to use that content solely to provide and improve the Service.
        </p>

        <h2>8. Disclaimers</h2>
        <p>
          The Service is provided &ldquo;as is&rdquo; and &ldquo;as available&rdquo; without warranties of any kind, express or implied. Namely does not warrant that the Service will be uninterrupted, error-free, or free of viruses. AI-generated name suggestions are generated by machine learning models and are provided for entertainment and inspiration purposes only — we make no guarantees about their accuracy, cultural sensitivity, or suitability.
        </p>

        <h2>9. Limitation of Liability</h2>
        <p>
          To the maximum extent permitted by applicable law, Namely LLC, its officers, directors, employees, and agents shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of or inability to use the Service. Our total liability to you for any claim arising from the Service shall not exceed the amount you paid to Namely in the 12 months preceding the claim.
        </p>

        <h2>10. Governing Law &amp; Dispute Resolution</h2>
        <p>
          These Terms are governed by the laws of the State of Wyoming, USA, without regard to its conflict of law provisions. Any disputes arising from these Terms or your use of the Service shall be resolved by binding arbitration in Wyoming, except that either party may seek injunctive relief in any court of competent jurisdiction.
        </p>

        <h2>11. Changes to These Terms</h2>
        <p>
          We may update these Terms from time to time. We will notify you of material changes via email or an in-app notice. Your continued use of the Service after changes are posted constitutes your acceptance of the revised Terms.
        </p>

        <h2>12. Contact Us</h2>
        <p>
          Questions about these Terms? Contact:<br />
          <strong>Namely LLC</strong><br />
          Email: <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a><br />
          Wyoming, USA
        </p>
      </div>
    </>
  );
}
