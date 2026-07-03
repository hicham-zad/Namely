import type { Metadata } from "next";
import Link from "next/link";
import JsonLd from "@/components/layout/JsonLd";
import type { BreadcrumbList, FAQPage, WithContext } from "schema-dts";

export const metadata: Metadata = {
  title: "FAQ — Frequently Asked Questions",
  description: "Answers to common questions about Namely: how the AI baby name matcher works, pricing, partner sync, cancellation, privacy, and account deletion.",
  alternates: { canonical: "https://matchbabynames.com/faq" },
  openGraph: { title: "FAQ | Namely", url: "https://matchbabynames.com/faq" },
};

const breadcrumb: WithContext<BreadcrumbList> = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: "https://matchbabynames.com" },
    { "@type": "ListItem", position: 2, name: "FAQ", item: "https://matchbabynames.com/faq" },
  ],
};

const faqGroups = [
  {
    group: "About Namely",
    items: [
      {
        q: "What is Namely?",
        a: "Namely is an AI-powered baby name matcher for couples. Both partners independently swipe through a curated and AI-generated list of baby names. A match is revealed only when both partners have liked the same name.",
      },
      {
        q: "How does the AI name generator work?",
        a: "When you set up your Namely account, you select your style preferences (classic, modern, unique, nature-inspired, etc.) and optionally your cultural background. Namely's AI uses these inputs to generate personalised name suggestions tailored to your taste. The AI can produce thousands of combinations that you won't find in a standard name book.",
      },
      {
        q: "How does the swipe-to-match mechanic work?",
        a: "Each partner independently swipes through names — swipe right to like, left to skip. The app never shows you which names your partner has liked or skipped until you both like the same name. When that happens, Namely reveals a 'It's a match!' screen. This removes pressure and makes the process feel like a fun shared discovery.",
      },
      {
        q: "What happens when we match on a name?",
        a: "When both partners like the same name, Namely shows a match notification to both of you at the same time. The matched name is added to your shared Matches list, which you can revisit and discuss at any time.",
      },
      {
        q: "Can I use Namely without a partner?",
        a: "Yes. You can browse and swipe names solo. However, the real-time partner sync and match detection features require both partners to have linked accounts.",
      },
      {
        q: "Is Namely available on Android?",
        a: "Yes. Namely is available on both iOS (App Store) and Android (Google Play). Both partners can be on different platforms — they work together seamlessly.",
      },
    ],
  },
  {
    group: "Getting Started",
    items: [
      {
        q: "How do I invite my partner?",
        a: "After creating your account, tap 'Invite Partner' on the home screen. You'll get a short code or shareable link. Your partner downloads Namely, creates their own account, and enters your code to link your accounts. Once linked, your swipe sessions sync in real time.",
      },
      {
        q: "What do I need to create an account?",
        a: "You need an email address and a password. You can also sign in with Apple (on iOS). No other personal information is required to get started.",
      },
      {
        q: "Can I change my style preferences after setup?",
        a: "Yes. You can update your style preferences in the Settings section of the app at any time. Updating your preferences will refresh the AI-generated name suggestions in your queue.",
      },
    ],
  },
  {
    group: "Pricing & Subscriptions",
    items: [
      {
        q: "Is Namely free?",
        a: "Namely is free to download. A $6.99/week subscription (with a 3-day free trial) is required to access unlimited AI name generation and real-time partner sync.",
      },
      {
        q: "What does the free trial include?",
        a: "The 3-day free trial includes full access to all paid features: unlimited AI name generation, real-time partner sync, and match notifications. No charge until the trial ends.",
      },
      {
        q: "How do I cancel my subscription?",
        a: "Cancel through your device's subscription settings. On iPhone: Settings → [Your Name] → Subscriptions → Namely → Cancel Subscription. On Android: Google Play → Profile → Payments & subscriptions → Subscriptions → Namely → Cancel. Cancellation takes effect at the end of the current billing period. Namely cannot process cancellations directly.",
      },
      {
        q: "Will I lose access immediately when I cancel?",
        a: "No. When you cancel, you keep full access to paid features until the end of your current billing period. After that, you revert to the free tier.",
      },
      {
        q: "How do I get a refund?",
        a: "Refunds are handled by Apple or Google. Request a refund through the App Store (support.apple.com) or Google Play (play.google.com/store). Namely does not issue refunds directly.",
      },
    ],
  },
  {
    group: "Privacy & Account",
    items: [
      {
        q: "Is my swipe data private?",
        a: "Yes. Your individual swipe choices are private. Your partner cannot see which names you've liked or skipped until you both like the same name. Namely does not share your personal data with third parties for advertising.",
      },
      {
        q: "Who can see my matched names?",
        a: "Only you and your linked partner can see your matched names list. No one else has access to your matches.",
      },
      {
        q: "How do I delete my account?",
        a: "Go to Settings in the Namely app and tap 'Delete Account'. Alternatively, email support@matchbabynames.com with the subject 'Account Deletion Request' and include your registered email. See our full instructions at matchbabynames.com/delete-account.",
      },
      {
        q: "What data does Namely collect?",
        a: "Namely collects your email address, swipe data, match data, and basic device information. Payment data is handled by Apple, Google, RevenueCat, and Stripe — Namely never stores your card number or payment details. See our full Privacy Policy for details.",
      },
      {
        q: "Does Namely sell my data?",
        a: "No. Namely does not sell your personal data to any third party. We do not use your data for advertising or build advertising profiles.",
      },
    ],
  },
  {
    group: "Technical",
    items: [
      {
        q: "What if my partner and I are both swiping at the same time?",
        a: "That's perfectly fine. Namely syncs swipe data in real time via Supabase. You can both swipe simultaneously without any issues — matches are detected automatically.",
      },
      {
        q: "What if I accidentally skip a name I liked?",
        a: "Once a name is swiped, it is permanently removed from your active queue and won't appear again. This is by design — it keeps your feed fresh. If you want to revisit a name, contact support and we can look into it.",
      },
      {
        q: "Does Namely work offline?",
        a: "No. Namely requires an internet connection to load name suggestions and sync swipes with your partner.",
      },
    ],
  },
];

const allItems = faqGroups.flatMap((g) => g.items);

const faqSchema: WithContext<FAQPage> = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: allItems.map((item) => ({
    "@type": "Question",
    name: item.q,
    acceptedAnswer: { "@type": "Answer", text: item.a },
  })),
};

export default function FaqPage() {
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
              <li className="text-slate-800/90">FAQ</li>
            </ol>
          </nav>
          <h1 className="text-3xl md:text-4xl font-extrabold" style={{ fontFamily: "var(--font-outfit)" }}>Frequently Asked Questions</h1>
          <p className="mt-3 text-slate-800/75 max-w-xl">
            Everything you need to know about Namely — how it works, pricing, privacy, and more.
          </p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-14">
        <div className="flex flex-col gap-14">
          {faqGroups.map((group) => (
            <section key={group.group} aria-labelledby={`faq-${group.group.toLowerCase().replace(/\s+/g, "-")}`}>
              <h2
                id={`faq-${group.group.toLowerCase().replace(/\s+/g, "-")}`}
                className="text-xl font-bold text-[#1e293b] mb-5 pb-3 border-b-2 border-[#f8fafc]"
                style={{ fontFamily: "var(--font-outfit)" }}
              >
                {group.group}
              </h2>
              <div className="flex flex-col gap-3">
                {group.items.map((item) => (
                  <details key={item.q} className="bg-white border border-[#f8fafc] rounded-xl overflow-hidden group">
                    <summary className="flex items-center justify-between gap-4 px-5 py-4 font-semibold text-[#1e293b] cursor-pointer hover:bg-[#f8fffe] transition-colors text-sm md:text-base">
                      {item.q}
                      <span className="text-[#9bccf5] text-xl shrink-0 group-open:rotate-45 transition-transform" aria-hidden="true">+</span>
                    </summary>
                    <div className="px-5 pb-4 text-[#6b7280] text-sm leading-relaxed">{item.a}</div>
                  </details>
                ))}
              </div>
            </section>
          ))}
        </div>

        {/* Still have questions */}
        <div className="mt-14 bg-[#f8fafc] border border-[#9bccf5]/20 rounded-2xl p-8 text-center">
          <h2 className="text-xl font-bold text-[#1e293b] mb-2" style={{ fontFamily: "var(--font-outfit)" }}>Still have questions?</h2>
          <p className="text-[#374151] mb-5 text-sm">We&rsquo;re happy to help. Email our support team and we&rsquo;ll get back to you within 1 business day.</p>
          <a
            href="mailto:support@matchbabynames.com"
            className="inline-flex items-center gap-2 bg-[#9bccf5] hover:bg-[#fb9cb0] text-slate-800 font-semibold px-5 py-3 rounded-xl transition-colors"
            id="faq-contact-btn"
          >
            Contact Support
          </a>
        </div>
      </div>
    </>
  );
}
