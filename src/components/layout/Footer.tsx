import Link from "next/link";

type FooterSection =
  | {
      kind: "text";
      title: string;
      items: string[];
    }
  | {
      kind: "links";
      title: string;
      links: { href: string; label: string }[];
    };

const footerSections: FooterSection[] = [
  {
    kind: "text",
    title: "Company",
    items: ["Garud AI", "Enterprise AI", "Mineral Intelligence"],
  },
  {
    kind: "text",
    title: "Platform",
    items: ["Satellite Analysis", "Computer Vision", "Expert Review"],
  },
  {
    kind: "links",
    title: "Navigation",
    links: [
      { href: "/", label: "Landing" },
      { href: "/dashboard", label: "Dashboard" },
      { href: "/analysis", label: "Analysis" },
      { href: "/history", label: "History" },
      { href: "/reports", label: "Reports" },
    ],
  },
  {
    kind: "text",
    title: "Contact",
    items: ["Enterprise inquiries", "support@garud.ai", "Mineral detection workflows"],
  },
];

const socialLinks = ["LinkedIn", "X", "GitHub"];

export function Footer() {
  return (
    <footer className="border-t border-white/10 bg-[color:var(--surface-strong)]/65">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-16">
        <div className="grid gap-10 lg:grid-cols-[1.1fr_1.9fr]">
          <div>
            <Link
              href="/"
              className="inline-flex items-center gap-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[color:var(--background)]"
            >
              <span className="inline-flex h-11 w-11 items-center justify-center overflow-hidden rounded-[0.7rem] border border-white/10 bg-white/[0.06]">
                <img src="/garud-icon-32.png" alt="" className="h-8 w-8" />
              </span>
              <span className="flex flex-col leading-tight">
                <span className="text-base font-semibold text-[color:var(--foreground)]">GARUD AI</span>
                <span className="text-[0.67rem] font-semibold uppercase tracking-[0.24em] text-[color:var(--foreground-muted)]">
                  Mineral Intelligence
                </span>
              </span>
            </Link>

            <p className="mt-5 max-w-sm text-sm leading-7 text-[color:var(--foreground-secondary)]">
              Premium AI-assisted mineral detection for teams working across satellite imagery, geospatial analysis and expert validation.
            </p>
          </div>

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {footerSections.map((section) => (
              <div key={section.title}>
                <h2 className="text-sm font-semibold text-[color:var(--foreground)]">{section.title}</h2>
                <ul className="mt-4 space-y-3 text-sm text-[color:var(--foreground-muted)]">
                  {section.kind === "links"
                    ? section.links.map((item) => (
                        <li key={item.href}>
                          <Link
                            href={item.href}
                            className="transition hover:text-[color:var(--foreground)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--primary)]"
                          >
                            {item.label}
                          </Link>
                        </li>
                      ))
                    : section.items.map((item) => <li key={item}>{item}</li>)}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-6 border-t border-white/10 pt-8 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-sm font-semibold text-[color:var(--foreground)]">Social Links</h2>
            <div className="mt-3 flex flex-wrap gap-3">
              {socialLinks.map((item) => (
                <span
                  key={item}
                  className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-sm text-[color:var(--foreground-secondary)]"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-3 text-sm text-[color:var(--foreground-muted)] sm:flex-row sm:items-center sm:gap-6">
            <span>Privacy Policy</span>
            <span>Terms of Service</span>
            <span>Copyright © {new Date().getFullYear()} Garud AI. All rights reserved.</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
