import type { Metadata } from "next";
import Link from "next/link";
import JsonLd from "@/components/layout/JsonLd";
import type { BreadcrumbList, FAQPage, WithContext } from "schema-dts";

export const metadata: Metadata = {
  title: "Support",
  description: "Get help with Namely. Contact our support team, find answers to common questions, and access privacy and account deletion resources.",
  alternates: { canonical: "https://matchbabynames.com/support" },
  openGraph: { title: "Support | Namely", url: "https://matchbabynames.com/support" },
};

const breadcrumb: WithContext<BreadcrumbList> = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: "https://matchbabynames.com" },
    { "@type": "ListItem", position: 2, name: "Support", item: "https://matchbabynames.com/support" },
  ],
};

const faqItems = [
  { q: "How do I invite my partner?", a: "Open the Namely app and tap 'Invite Partner' on the home screen. You'll receive a short code or shareable link. Your partner downloads Namely, creates an account, and enters the code to link your sessions." },
  { q: "Is Namely free?", a: "Namely is free to download. A $6.99/week subscription (with a 3-day free trial) unlocks unlimited AI name generation and real-time partner sync." },
  { q: "How does the swipe-to-match work?", a: "Both partners swipe through names independently. A match notification appears only when both of you have liked the same name. There's no way for one partner to see what the other has swiped until a match occurs." },
  { q: "What happens when we match on a name?", a: "When both partners like the same name, Namely shows a 'It's a match!' screen with the matched name. The name is added to your shared matches list, which you can revisit at any time." },
  { q: "Can I use Namely without a partner?", a: "Yes. You can browse and swipe names solo. However, real-time matching requires both partners to have an account and be linked." },
  { q: "How do I cancel my subscription?", a: "On iPhone: Settings → [Your Name] → Subscriptions → Namely → Cancel. On Android: Google Play → Profile → Payments & subscriptions → Subscriptions → Namely → Cancel. Namely cannot process cancellations directly." },
  { q: "How do I delete my account?", a: "Go to Settings inside the Namely app and tap 'Delete Account'. You can also email support@matchbabynames.com with the subject 'Account Deletion Request'. See our full instructions at matchbabynames.com/delete-account." },
  { q: "Is my data private?", a: "Yes. Namely does not sell your data. Your swipe history and partner match data are private to your linked pair. Payment data is handled by Apple, Google, RevenueCat, and Stripe — Namely never stores your card details. See our Privacy Policy for full details." },
];

const faqSchema: WithContext<FAQPage> = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqItems.map((item) => ({
    "@type": "Question",
    name: item.q,
    acceptedAnswer: { "@type": "Answer", text: item.a },
  })),
};

const CONTACT_EMAIL = "support@matchbabynames.com";

export default function SupportPage() {
  return (
    <>
      <JsonLd data={breadcrumb} />
      <JsonLd data={faqSchema} />

      <div className="bg-white text-slate-800 py-14">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <nav aria-label="Breadcrumb" className="text-sm text-slate-800/60 mb-3">
            <ol className="flex items-center gap-2">
              <li><Link href="/" className="hover:text-slate-800 transition-colors">Home</Link></li>
              <li aria-hidden="true">›</li>
              <li className="text-slate-800/90">Support</li>
            </ol>
          </nav>
          <h1 className="text-3xl md:text-4xl font-extrabold" style={{ fontFamily: "var(--font-outfit)" }}>Support</h1>
          <p className="mt-3 text-slate-800/75">We&rsquo;re here to help. Get in touch or find answers below.</p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-14">

        {/* Contact card */}
        <section aria-labelledby="contact-heading" className="bg-[#f8fafc] border border-[#9bccf5]/20 rounded-2xl p-8 mb-14">
          <h2 id="contact-heading" className="text-2xl font-bold text-[#1e293b] mb-3" style={{ fontFamily: "var(--font-outfit)" }}>Contact Us</h2>
          <p className="text-[#374151] mb-4">
            For account issues, billing questions, or anything else, email our support team. We respond within 1 business day.
          </p>
          <a
            href={`mailto:${CONTACT_EMAIL}`}
            className="inline-flex items-center gap-2 bg-[#9bccf5] hover:bg-[#fb9cb0] text-slate-800 font-semibold px-5 py-3 rounded-xl transition-colors"
            id="support-email-btn"
          >
            <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            {CONTACT_EMAIL}
          </a>
        </section>

        {/* Quick links */}
        <section aria-labelledby="quick-links-heading" className="mb-14">
          <h2 id="quick-links-heading" className="text-2xl font-bold text-[#1e293b] mb-5" style={{ fontFamily: "var(--font-outfit)" }}>Helpful Links</h2>
          <div className="grid sm:grid-cols-3 gap-4">
            {[
              { href: "/privacy", label: "Privacy Policy", desc: "How we handle your data" },
              { href: "/terms", label: "Terms of Service", desc: "Subscription & usage terms" },
              { href: "/delete-account", label: "Delete Account", desc: "Step-by-step instructions" },
            ].map((link) => (
              <Link key={link.href} href={link.href}
                className="block bg-white border border-[#f8fafc] rounded-xl p-5 hover:border-[#9bccf5] hover:shadow-sm transition-all card-lift">
                <p className="font-semibold text-[#1e293b] mb-1">{link.label}</p>
                <p className="text-sm text-[#6b7280]">{link.desc}</p>
              </Link>
            ))}
          </div>
        </section>

        {/* FAQ */}
        <section aria-labelledby="faq-heading">
          <h2 id="faq-heading" className="text-2xl font-bold text-[#1e293b] mb-6" style={{ fontFamily: "var(--font-outfit)" }}>Frequently Asked Questions</h2>
          <div className="flex flex-col gap-3">
            {faqItems.map((item) => (
              <details key={item.q} className="bg-white border border-[#f8fafc] rounded-xl overflow-hidden group">
                <summary className="flex items-center justify-between gap-4 px-5 py-4 font-semibold text-[#1e293b] cursor-pointer hover:bg-[#f8fffe] transition-colors text-sm md:text-base">
                  {item.q}
                  <span className="text-[#9bccf5] text-xl shrink-0 group-open:rotate-45 transition-transform" aria-hidden="true">+</span>
                </summary>
                <div className="px-5 pb-4 text-[#6b7280] text-sm leading-relaxed">{item.a}</div>
              </details>
            ))}
          </div>
          <div className="mt-6 text-center">
            <Link href="/faq" className="text-[#9bccf5] font-semibold hover:text-[#fb9cb0] transition-colors text-sm">
              See all FAQs →
            </Link>
          </div>
        </section>
      </div>
    </>
  );
}
