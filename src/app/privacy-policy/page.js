export const metadata = {
  title: "Privacy Policy - Inkarp Instruments Pvt Ltd",
  description:
    "How Inkarp Instruments Private Ltd collects, uses, and safeguards your personal information.",
};

const sections = [
  {
    title: "1. Information We Collect",
    items: [
      "Information: Name, email address, phone number, and any other details you provide through forms or email communications.",
      "Usage Data: Information related to how you use the Website, such as IP address, browser type, device information, and browsing behaviour.",
      "Cookies: We use cookies to improve your browsing experience and understand user preferences. You can manage cookie preferences through your browser settings.",
    ],
  },
  {
    title: "2. How We Use Your Information",
    body: "We use the collected information for purposes including but not limited to:",
    items: [
      "Responding to inquiries and providing customer support.",
      "Improving our products, services, and the overall user experience on the Website.",
      "Sending updates, promotions, or other communications related to our services if you have opted to receive them.",
      "Analysing usage patterns and improving website functionality.",
    ],
  },
  {
    title: "3. Data Security",
    items: [
      "We take reasonable precautions to protect your personal information from unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the internet or electronic storage is completely secure.",
    ],
  },
  {
    title: "4. Sharing of Personal Information",
    items: [
      "We do not sell or rent your personal information to third parties. We may disclose your personal information to service providers or partners where necessary to provide services (for example: hosting, analytics, or customer support), and only to the extent required to perform those services.",
    ],
  },
  {
    title: "5. Your Rights",
    items: [
      "Request access to personal information we hold about you.",
      "Request correction of inaccurate or incomplete data.",
      "Request deletion of your personal information, subject to legal obligations.",
      "Opt out of receiving marketing communications at any time.",
    ],
  },
  {
    title: "6. Third-Party Links",
    items: [
      "Our Website may contain links to third-party websites. We are not responsible for the privacy practices or content of these external sites. We encourage you to review their privacy policies before providing any personal information.",
    ],
  },
  {
    title: "7. Changes to This Policy",
    items: [
      "We reserve the right to update or modify this Privacy Policy at any time. Any changes will be posted on this page with an updated revision date. Please review this Privacy Policy periodically.",
    ],
  },
  {
    title: "8. Contact Us",
    body: "If you have any questions about this Privacy Policy or how we handle your personal information, please contact us at:",
    items: [
      "Inkarp Instruments Pvt Ltd",
      "Email: info@inkarp.co.in",
    ],
  },
];

export default function PrivacyPolicy() {
  return (
    <main className="bg-white text-zinc-900">
      <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <header className="rounded-lg border border-zinc-200 bg-zinc-50 p-6 text-center shadow-sm sm:p-8">
          <h1 className="font-maxot text-3xl text-[#E63946] sm:text-4xl">
            Privacy Policy
          </h1>
        </header>

        <div className="mt-8 space-y-8 rounded-lg border border-zinc-200 bg-white p-5 shadow-sm sm:p-8">
          <article>
            <h2 className="font-maxot text-xl text-[#E63946]">Overview</h2>
            <p className="mt-3 text-base leading-8 text-zinc-700">
              At Inkarp we are committed to protecting the privacy and
              security of our website visitors and customers. This Privacy
              Policy explains how we collect, use, and safeguard your
              personal information when you visit or interact with our
              website (
              <a className="underline" href="https://www.inkarp.co.in">
                www.inkarp.co.in
              </a>
              ) (the &quot;Website&quot;).
            </p>
          </article>

          {sections.map((section) => (
            <article className="border-t border-zinc-100 pt-7" key={section.title}>
              <h2 className="font-maxot text-xl text-[#E63946]">
                {section.title}
              </h2>

              {section.body ? (
                <p className="mt-3 text-base leading-8 text-zinc-700">
                  {section.body}
                </p>
              ) : null}

              {section.items ? (
                <ul className="mt-3 list-disc space-y-2 pl-5 text-base leading-8 text-zinc-700 marker:text-[#BE0010]">
                  {section.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              ) : null}
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
