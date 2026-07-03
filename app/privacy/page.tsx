import type { Metadata } from "next";
import Link from "next/link";
import JsonLd from "@/components/layout/JsonLd";
import type { BreadcrumbList, WithContext } from "schema-dts";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How Namely collects, uses, and protects your personal data. Covers RevenueCat, Stripe, Supabase, data retention, and your rights.",
  alternates: { canonical: "https://matchbabynames.com/privacy" },
  openGraph: { title: "Privacy Policy | Namely", url: "https://matchbabynames.com/privacy" },
};

const breadcrumb: WithContext<BreadcrumbList> = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: "https://matchbabynames.com" },
    { "@type": "ListItem", position: 2, name: "Privacy Policy", item: "https://matchbabynames.com/privacy" },
  ],
};

const EFFECTIVE_DATE = "1 July 2025";
const CONTACT_EMAIL = "support@matchbabynames.com";

export default function PrivacyPage() {
  return (
    <>
      <JsonLd data={breadcrumb} />

      {/* Page header */}
      <div className="bg-white text-slate-800 py-14">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <nav aria-label="Breadcrumb" className="text-sm text-slate-800/60 mb-3">
            <ol className="flex items-center gap-2">
              <li><Link href="/" className="hover:text-slate-800 transition-colors">Home</Link></li>
              <li aria-hidden="true">›</li>
              <li className="text-slate-800/90">Privacy Policy</li>
            </ol>
          </nav>
          <h1 className="text-3xl md:text-4xl font-extrabold" style={{ fontFamily: "var(--font-outfit)" }}>Privacy Policy</h1>
          <p className="mt-3 text-slate-800/75">Effective date: {EFFECTIVE_DATE}</p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-14 prose-legal">
        <p>
          Namely LLC (&ldquo;Namely&rdquo;, &ldquo;we&rdquo;, &ldquo;us&rdquo;, or &ldquo;our&rdquo;) operates the Namely mobile application (the &ldquo;App&rdquo;) and the website at matchbabynames.com (the &ldquo;Site&rdquo;). This Privacy Policy explains what personal data we collect, how we use it, and your rights regarding that data.
        </p>
        <p>By using Namely, you agree to the practices described in this policy.</p>

        <h2>1. What We Collect</h2>
        <h3>Account Information</h3>
        <ul>
          <li><strong>Email address</strong> — collected when you create an account or sign in.</li>
          <li><strong>Display name</strong> — optionally provided during onboarding.</li>
          <li><strong>Partner link code</strong> — a short code used to connect two accounts.</li>
        </ul>

        <h3>Usage Data</h3>
        <ul>
          <li><strong>Swipe data</strong> — which names you liked or skipped.</li>
          <li><strong>Match data</strong> — names that both you and your partner liked.</li>
          <li><strong>Session activity</strong> — timestamps of app opens and swipe activity.</li>
        </ul>

        <h3>Device &amp; Technical Data</h3>
        <ul>
          <li>Device type, operating system version, and app version.</li>
          <li>IP address (used for security and fraud prevention; not retained long-term).</li>
          <li>Crash logs and performance diagnostics (anonymised).</li>
        </ul>

        <h3>Payment Data</h3>
        <p>
          Subscription billing is handled entirely by <strong>RevenueCat</strong> and <strong>Stripe</strong> (via the App Store or Google Play). Namely does <strong>not</strong> collect or store raw credit card numbers, bank details, or full payment credentials. We receive only subscription status signals (active, cancelled, expired) from RevenueCat.
        </p>

        <h2>2. How We Use Your Data</h2>
        <ul>
          <li>To provide and operate the Namely service.</li>
          <li>To sync your swipe data with your partner in real time.</li>
          <li>To detect and notify you of name matches.</li>
          <li>To manage your subscription status via RevenueCat.</li>
          <li>To send transactional emails (e.g., account confirmation, password reset).</li>
          <li>To improve the app through anonymised analytics and crash data.</li>
          <li>To comply with legal obligations.</li>
        </ul>
        <p>We do <strong>not</strong> sell your personal data to third parties. We do not use your data for advertising.</p>

        <h2>3. Third-Party Services</h2>
        <p>Namely uses the following third-party services, each of which operates under its own privacy policy:</p>

        <h3>Supabase</h3>
        <p>
          We use Supabase for our database, authentication, and real-time data sync. Your account information and swipe/match data are stored in Supabase (hosted on AWS). Supabase processes data in accordance with GDPR and SOC 2 standards.
          <br /><a href="https://supabase.com/privacy" target="_blank" rel="noopener noreferrer">Supabase Privacy Policy →</a>
        </p>

        <h3>RevenueCat</h3>
        <p>
          RevenueCat manages in-app subscription purchases and entitlements. RevenueCat receives your App Store or Google Play purchase receipts and your Namely user ID. They do not have access to your swipe or match data.
          <br /><a href="https://www.revenuecat.com/privacy" target="_blank" rel="noopener noreferrer">RevenueCat Privacy Policy →</a>
        </p>

        <h3>Stripe</h3>
        <p>
          Stripe processes payment transactions initiated through the App Store or Google Play. Stripe may receive device and transaction data for fraud prevention purposes.
          <br /><a href="https://stripe.com/privacy" target="_blank" rel="noopener noreferrer">Stripe Privacy Policy →</a>
        </p>

        <h3>Apple App Store / Google Play</h3>
        <p>
          When you download the App or make a purchase, Apple or Google collect data in accordance with their own privacy policies. We do not control the data they collect.
        </p>

        <h3>Analytics</h3>
        <p>
          We may use anonymised, aggregated analytics tools to measure app performance and understand how users navigate the app. No personally identifiable information is shared with analytics providers. No behavioural advertising profiles are created.
        </p>

        <h2>4. Data Retention</h2>
        <p>
          We retain your personal data for as long as your account is active or as needed to provide the service. If you delete your account:
        </p>
        <ul>
          <li>Your account, email, swipe history, and match data are permanently deleted within 30 days.</li>
          <li>Anonymised, aggregated analytics data (which cannot identify you) may be retained indefinitely.</li>
          <li>Subscription transaction records may be retained for up to 7 years for tax and legal compliance purposes, but these are held by Apple, Google, RevenueCat, or Stripe — not by Namely directly.</li>
        </ul>

        <h2>5. Your Rights</h2>
        <p>Depending on your location, you may have the following rights regarding your personal data:</p>
        <ul>
          <li><strong>Access</strong> — You can request a copy of the personal data we hold about you.</li>
          <li><strong>Correction</strong> — You can ask us to correct inaccurate data.</li>
          <li><strong>Deletion</strong> — You can request that we delete your account and all associated data. See our <Link href="/delete-account">Account Deletion page</Link> for instructions.</li>
          <li><strong>Portability</strong> — You can request an export of your data in a machine-readable format.</li>
          <li><strong>Objection</strong> — You can object to certain types of data processing.</li>
        </ul>
        <p>To exercise any of these rights, email us at <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>. We will respond within 30 days.</p>

        <h2>6. Children&rsquo;s Privacy (COPPA)</h2>
        <p>
          Namely is designed for adults (parents and expectant parents). The App is not directed at children under the age of 13. We do not knowingly collect personal data from children under 13. If we discover we have inadvertently collected data from a child under 13, we will delete it immediately.
        </p>
        <p>
          If you believe we have collected data from a child under 13, please contact us at <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.
        </p>

        <h2>7. Data Security</h2>
        <p>
          We use industry-standard security measures including TLS encryption in transit and encrypted storage at rest (via Supabase). No method of transmission over the internet is 100% secure. We cannot guarantee absolute security, but we take reasonable steps to protect your data.
        </p>

        <h2>8. Changes to This Policy</h2>
        <p>
          We may update this Privacy Policy from time to time. When we do, we will update the effective date at the top of this page. We will notify you of material changes via email or an in-app notice. Your continued use of Namely after changes are posted constitutes your acceptance of the revised policy.
        </p>

        <h2>9. Contact Us</h2>
        <p>
          For any privacy-related questions or requests, please contact:<br />
          <strong>Namely LLC</strong><br />
          Email: <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a><br />
          Wyoming, USA
        </p>
      </div>
    </>
  );
}
