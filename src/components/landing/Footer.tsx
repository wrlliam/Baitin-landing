import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-border py-20">
      <div className="mx-auto max-w-6xl px-8 sm:px-10">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <p className="mb-3 text-sm font-bold text-text">🎣 Baitin</p>
            <p className="max-w-xs text-xs leading-relaxed text-muted">
              The fishing economy bot your Discord server deserves. Free, open source, and always improving.
            </p>
          </div>
          <div>
            <h4 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-2">Navigation</h4>
            <ul className="space-y-2 text-xs text-muted">
              <li><Link href="/" className="transition-colors hover:text-text">Home</Link></li>
              <li><Link href="/#features" className="transition-colors hover:text-text">Features</Link></li>
              <li><Link href="/wiki" className="transition-colors hover:text-text">Wiki</Link></li>
              <li><Link href="/commands" className="transition-colors hover:text-text">Commands</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-2">Resources</h4>
            <ul className="space-y-2 text-xs text-muted">
              <li><a href="https://github.com/wrlliam/baitin" target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-text">GitHub</a></li>
              <li><span>Apache-2.0 License</span></li>
            </ul>
          </div>
          <div>
            <h4 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-2">Legal</h4>
            <ul className="space-y-2 text-xs text-muted">
              <li><Link href="/privacy" className="transition-colors hover:text-text">Privacy Policy</Link></li>
              <li><Link href="/terms" className="transition-colors hover:text-text">Terms of Service</Link></li>
            </ul>
          </div>
        </div>
        <div className="mt-16 flex items-center justify-between border-t border-border pt-10">
          <p className="text-[11px] text-muted-2">&copy; {new Date().getFullYear()} Baitin. All rights reserved.</p>
          <a href="https://github.com/wrlliam/baitin" target="_blank" rel="noopener noreferrer" className="text-muted transition-colors hover:text-text" aria-label="GitHub">
            <svg height="16" viewBox="0 0 16 16" width="16" fill="currentColor">
              <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
            </svg>
          </a>
        </div>
      </div>
    </footer>
  );
}
