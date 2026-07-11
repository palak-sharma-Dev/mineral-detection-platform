export function Footer() {
  return (
    <footer className="border-t border-[color:var(--foreground-muted)]/15 py-6">
      <div className="mx-auto max-w-6xl px-4 text-center text-sm text-[color:var(--foreground-secondary)] sm:px-6 lg:px-8">
        <p>© {new Date().getFullYear()} Garud AI. All rights reserved.</p>
      </div>
    </footer>
  );
}
