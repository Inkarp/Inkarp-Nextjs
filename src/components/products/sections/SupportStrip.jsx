'use client';
import Link from 'next/link';

export default function SupportStrip({ productName }) {
  const items = [
    { icon: '📞', label: 'Call Inkarp', sub: 'Speak to a specialist', href: '/contact' },
    { icon: '✉️', label: 'Email enquiry', sub: 'info@inkarp.co.in', href: 'mailto:info@inkarp.co.in' },
    { icon: '📄', label: 'Request brochure', sub: 'PDF + datasheet', href: '/contact' },
    { icon: '🔧', label: 'Service support', sub: 'Installation & maintenance', href: '/contact' },
  ];

  return (
    <section className="border-b border-[#BE0010]/15 bg-[#fff3f4] px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6 text-center">
          <p className="text-xs font-semibold uppercase tracking-widest text-[#BE0010]">Inkarp support for {productName ?? 'this product'}</p>
          <h2 className="font-maxot mt-1 text-xl text-black dark:text-zinc-100 sm:text-2xl">How can we help?</h2>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((item) => (
            <Link key={item.label} href={item.href}
              className="flex items-center gap-3 rounded-xl border border-[#BE0010]/15 bg-white dark:bg-zinc-900 px-4 py-3.5 shadow-sm shadow-[#BE0010]/5 transition hover:border-[#BE0010]/35 hover:bg-[#BE0010]/5">
              <span className="text-xl">{item.icon}</span>
              <div>
                <div className="text-sm font-semibold text-black dark:text-zinc-100">{item.label}</div>
                <div className="text-xs text-black dark:text-zinc-400">{item.sub}</div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
