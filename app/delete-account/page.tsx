import type { Metadata } from "next";
import Link from "next/link";
import JsonLd from "@/components/layout/JsonLd";
import type { BreadcrumbList, WithContext } from "schema-dts";

export const metadata: Metadata = {
  title: "Delete Your Account",
  description: "How to delete your Namely account and all associated data. Step-by-step instructions for in-app deletion and web-based deletion requests.",
  alternates: { canonical: "https://matchbabynames.com/delete-account" },
  openGraph: { title: "Delete Account | Namely", url: "https://matchbabynames.com/delete-account" },
};

const breadcrumb: WithContext<BreadcrumbList> = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: "https://matchbabynames.com" },
    { "@type": "ListItem", position: 2, name: "Delete Account", item: "https://matchbabynames.com/delete-account" },
  ],
};

const CONTACT_EMAIL = "support@matchbabynames.com";

export default function DeleteAccountPage() {
  return (
    <>
      <JsonLd data={breadcrumb} />

      <div className="bg-white text-slate-800 py-14">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <nav aria-label="Breadcrumb" className="text-sm text-slate-800/60 mb-3">
            <ol className="flex items-center gap-2">
              <li><Link href="/" className="hover:text-slate-800 transition-colors">Home</Link></li>
              <li aria-hidden="true">›</li>
              <li className="text-slate-800/90">Delete Account</li>
            </ol>
          </nav>
          <h1 className="text-3xl md:text-4xl font-extrabold" style={{ fontFamily: "var(--font-outfit)" }}>Delete Your Account</h1>
          <p className="mt-3 text-slate-800/75">Your data belongs to you. Here&rsquo;s how to permanently delete your Namely account.</p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-14 prose-legal">

        <div className="bg-[#fce4ec] border border-[#f48fb1]/30 rounded-2xl p-6 mb-10">
          <p className="text-[#1e293b] font-semibold mb-1">Before you delete</p>
          <p className="text-[#374151] text-sm">
            If you have an active subscription, <strong>cancel your subscription first</strong> through your App Store or Google Play settings. Deleting your account does not automatically cancel your subscription, and you will continue to be billed until you cancel through Apple or Google.
          </p>
        </div>

        <h2>Option 1: Delete In-App (Recommended)</h2>
        <p>You can delete your account directly from within the Namely app:</p>
        <ol style={{ listStyle: "decimal", paddingLeft: "1.5rem", marginBottom: "1rem" }}>
          <li>Open the <strong>Namely</strong> app on your device.</li>
          <li>Tap the <strong>Settings</strong> icon (gear icon in the bottom navigation bar or profile screen).</li>
          <li>Scroll down to the <strong>Account</strong> section.</li>
          <li>Tap <strong>Delete Account</strong>.</li>
          <li>Read the confirmation message, then tap <strong>Confirm Delete</strong>.</li>
        </ol>
        <p>Your account and all associated data will be permanently deleted within <strong>30 days</strong>.</p>

        <h2>Option 2: Request Deletion by Email</h2>
        <p>
          If you cannot access the app or prefer to request deletion by email, send a message to:
        </p>
        <div className="bg-[#f8fafc] rounded-xl p-5 my-4">
          <p className="font-semibold text-[#1e293b] mb-1">Email:</p>
          <a href={`mailto:${CONTACT_EMAIL}?subject=Account Deletion Request`}
            className="text-[#9bccf5] font-medium hover:text-[#fb9cb0] underline">
            {CONTACT_EMAIL}
          </a>
          <p className="font-semibold text-[#1e293b] mt-3 mb-1">Subject line:</p>
          <p className="font-mono text-sm bg-white rounded-lg px-3 py-2 inline-block">Account Deletion Request</p>
          <p className="font-semibold text-[#1e293b] mt-3 mb-1">Include in your message:</p>
          <ul>
            <li>The email address registered to your Namely account.</li>
            <li>A brief statement that you want your account and all associated data deleted.</li>
          </ul>
        </div>
        <p>We will process your request and confirm deletion within <strong>5 business days</strong>.</p>

        <h2>What Happens to Your Data</h2>
        <p>When your account is deleted, we permanently delete or anonymise:</p>
        <ul>
          <li>Your email address and account credentials.</li>
          <li>Your swipe history (all liked and skipped names).</li>
          <li>Your match data (names both you and your partner liked).</li>
          <li>Your partner link (your partner&rsquo;s account continues, unlinked).</li>
          <li>Your style preferences and onboarding data.</li>
        </ul>

        <h2>What We Retain After Deletion</h2>
        <p>After your account is deleted, the following data may be retained:</p>
        <ul>
          <li>
            <strong>Anonymised analytics</strong> — aggregated, non-identifiable usage statistics (e.g., total names swiped per session). These cannot be linked back to you.
          </li>
          <li>
            <strong>Transaction records</strong> — subscription purchase history is retained by Apple, Google, RevenueCat, and Stripe for tax and legal compliance purposes (typically up to 7 years). Namely does not retain these records directly.
          </li>
          <li>
            <strong>Legal obligations</strong> — where applicable law requires us to retain certain data, we will retain it for the minimum required period and then delete it.
          </li>
        </ul>

        <h2>Cancel Your Subscription</h2>
        <p>Remember: account deletion does not cancel your subscription. Cancel separately:</p>
        <ul>
          <li><strong>iPhone</strong>: Settings → [Your Name] → Subscriptions → Namely → Cancel Subscription</li>
          <li><strong>Android</strong>: Google Play → Profile → Payments &amp; subscriptions → Subscriptions → Namely → Cancel</li>
        </ul>

        <h2>Questions?</h2>
        <p>
          Contact us at <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a> — we&rsquo;re happy to help.
        </p>

        <div className="mt-8 pt-6 border-t border-[#f8fafc] flex gap-6 text-sm">
          <Link href="/privacy" className="text-[#9bccf5] hover:text-[#fb9cb0] font-medium">Privacy Policy</Link>
          <Link href="/support" className="text-[#9bccf5] hover:text-[#fb9cb0] font-medium">Support</Link>
          <Link href="/terms" className="text-[#9bccf5] hover:text-[#fb9cb0] font-medium">Terms of Service</Link>
        </div>
      </div>
    </>
  );
}
