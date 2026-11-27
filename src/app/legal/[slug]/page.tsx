import { notFound } from "next/navigation";
import Link from "next/link";
import { ShieldCheck, ChevronLeft } from "lucide-react";

interface LegalContent {
  title: string;
  subtitle: string;
  lastUpdated: string;
  sections: { heading: string; body: string }[];
}

const LEGAL_DOCS: Record<string, LegalContent> = {
  terms: {
    title: "Terms of Service",
    subtitle: "Guidelines and legal terms governing the use of the KEYRA rental platform.",
    lastUpdated: "November 2026",
    sections: [
      {
        heading: "1. Acceptance of Terms",
        body: "By accessing or using the KEYRA platform (website, mobile applications, and physical concierge services), you agree to be bound by these Terms of Service. KEYRA is operated by KEYRA Technologies Pvt. Ltd., headquartered in Pune, Maharashtra.",
      },
      {
        heading: "2. Zero Brokerage Guarantee",
        body: "KEYRA is a direct landlord-tenant marketplace. We strictly prohibit middlemen, unauthorized real estate agents, or brokers from harvesting contact details or demanding commission from tenants. Any account detected soliciting brokerage fees will be permanently banned.",
      },
      {
        heading: "3. Property Listings and Accuracy",
        body: "Landlords are solely responsible for ensuring the truthfulness of property details, rent, and deposit amounts. KEYRA reserves the right to unpublish, verify, or audit any property listing through physical field inspections.",
      },
      {
        heading: "4. Visit Scheduling and Conduct",
        body: "Users can schedule physical property visits with a nominal ₹39 fee per visit for field executive guided assistance. Repeated no-shows or abusive behavior towards KEYRA field executives or property owners will result in visit scheduling suspension.",
      },
      {
        heading: "5. Limitation of Liability",
        body: "KEYRA facilitates discovery, physical walkthroughs, and rental agreement execution. The final lease contract is entered into directly between the property owner and the tenant.",
      },
    ],
  },
  privacy: {
    title: "Privacy Policy",
    subtitle: "How KEYRA collects, protects, and handles your personal information.",
    lastUpdated: "November 2026",
    sections: [
      {
        heading: "1. Information We Collect",
        body: "We collect mobile phone numbers via OTP authentication, user names, email addresses, property listing details, and geocoded location coordinates necessary to facilitate rental discovery.",
      },
      {
        heading: "2. Owner Contact Privacy & Protection",
        body: "To prevent spam and broker harassment, owner contact numbers are never published in raw or public website payloads. Numbers are unlocked exclusively by authenticated platform users through our secure contact unlock protocol.",
      },
      {
        heading: "3. Document Confidentiality",
        body: "Ownership documents (such as electricity bills, index II, or society maintenance receipts) uploaded during property verification are stored in private encrypted object storage and are never shared publicly.",
      },
      {
        heading: "4. Data Sharing & Third Parties",
        body: "We do not sell, rent, or trade your personal data to marketing third parties. Data is shared solely with payment gateways (Razorpay) and SMS providers (Twilio) strictly for transactional execution.",
      },
    ],
  },
  refund: {
    title: "Refund & Cancellation Policy",
    subtitle: "Details regarding payment cancellations, subscription refunds, and deposit guarantees.",
    lastUpdated: "November 2026",
    sections: [
      {
        heading: "1. Subscription & Care Plan Refunds",
        body: "KEYRA Care Plan subscriptions may be cancelled within 7 days of activation for a full refund if no maintenance service or deep cleaning dispatch has been utilized.",
      },
      {
        heading: "2. Visit Refill Pack Policy",
        body: "Visit refill packs (₹99) are valid for 90 days. Unused visit credits are non-refundable once activated.",
      },
      {
        heading: "3. Owner Cashback Rewards",
        body: "The ₹500 owner rental reward is directly credited to the owner's bank account or wallet upon successful tenant placement and lease confirmation. Fraudulent self-deals will be reversed.",
      },
    ],
  },
  "fair-use": {
    title: "Zero Brokerage & Fair Use Policy",
    subtitle: "Our commitment to keeping Pune West rentals 100% free of broker commissions.",
    lastUpdated: "November 2026",
    sections: [
      {
        heading: "1. Strict Anti-Brokerage Stance",
        body: "KEYRA was founded to eradicate broker extortion. No landlord or tenant on KEYRA shall ever pay a brokerage fee for any listing discovered on our platform.",
      },
      {
        heading: "2. Verified Badges",
        body: "Properties carrying the 'KEYRA Inspected' badge have undergone an in-person physical inspection by our field staff, confirming real carpet area, water supply, and society amenities.",
      },
      {
        heading: "3. Reporting Violations",
        body: "If any individual claiming to represent KEYRA or an owner asks for a brokerage commission, please immediately report the listing via support@keyra.in or our emergency dispute line.",
      },
    ],
  },
};

export default async function LegalPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const doc = LEGAL_DOCS[slug];

  if (!doc) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-12 w-full space-y-8">
      <Link
        href="/"
        className="inline-flex items-center text-xs font-semibold text-slate-500 hover:text-slate-800"
      >
        <ChevronLeft className="h-4 w-4 mr-1" /> Back to Home
      </Link>

      <div className="border-b border-slate-200 pb-6">
        <span className="text-[11px] font-bold uppercase tracking-wider text-[#006A61] bg-[#E6F5F3] px-2.5 py-1 rounded-full">
          Legal & Compliance
        </span>
        <h1 className="font-heading text-3xl sm:text-4xl font-extrabold text-[#0F1E36] mt-2">
          {doc.title}
        </h1>
        <p className="text-sm text-slate-500 mt-1">{doc.subtitle}</p>
        <p className="text-xs text-slate-400 mt-2">Last Updated: {doc.lastUpdated}</p>
      </div>

      <div className="space-y-6">
        {doc.sections.map((sec, idx) => (
          <div
            key={idx}
            className="rounded-2xl border border-slate-200 bg-white p-6 shadow-card space-y-2"
          >
            <h3 className="font-heading text-base sm:text-lg font-bold text-[#0F1E36]">
              {sec.heading}
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed">{sec.body}</p>
          </div>
        ))}
      </div>

      <div className="rounded-2xl border border-[#006A61]/20 bg-[#E6F5F3]/50 p-6 flex items-start gap-3.5">
        <ShieldCheck className="h-6 w-6 text-[#006A61] shrink-0 mt-0.5" />
        <div className="text-xs text-[#006A61] leading-relaxed">
          <strong>Questions or Legal Inquiries?</strong> Contact our legal team at{" "}
          <a href="mailto:legal@keyra.in" className="underline font-bold">
            legal@keyra.in
          </a>{" "}
          or visit KEYRA Technologies Pvt. Ltd., Balewadi High Street, Pune, Maharashtra 411045.
        </div>
      </div>
    </div>
  );
}
