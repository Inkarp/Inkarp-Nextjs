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
    <section className="border-b border-line-light bg-parchment px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[1180px]">
        <div className="mb-6 text-center">
          <p className="text-xs font-semibold uppercase tracking-widest text-ink-soft">Inkarp support for {productName ?? 'this product'}</p>
          <h2 className="mt-1 text-xl font-semibold tracking-tight text-ink sm:text-2xl">How can we help?</h2>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((item) => (
            <Link key={item.label} href={item.href}
              className="flex items-center gap-3 border border-line-light bg-parchment px-4 py-3.5 transition hover:border-line-light hover:bg-parchment-alt">
              <span className="text-xl">{item.icon}</span>
              <div>
                <div className="text-sm font-semibold text-black">{item.label}</div>
                <div className="text-xs text-black">{item.sub}</div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
