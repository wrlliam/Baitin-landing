import { type Metadata } from "next";
import Footer from "~/components/landing/Footer";
import Navbar from "~/components/landing/Navbar";

export const metadata: Metadata = {
  title: "Terms of Service — Baitin 🎣",
  description: "Terms of Service for the Baitin Discord bot.",
};

export default function TermsPage() {
  return (
    <>
      <Navbar />
      <main className="py-16 sm:py-24">
        <article className="mx-auto max-w-3xl px-6">
          <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-accent">Legal</p>
          <h1 className="mb-2 text-3xl font-bold tracking-tight sm:text-4xl">Terms of Service</h1>
          <p className="mb-10 text-sm text-muted">Last updated: March 24, 2026</p>

          <div className="space-y-8 text-sm leading-relaxed text-muted [&_h2]:mb-3 [&_h2]:text-lg [&_h2]:font-semibold [&_h2]:text-text [&_ul]:ml-4 [&_ul]:list-disc [&_ul]:space-y-1.5 [&_p]:mb-3">
            <section>
              <h2>1. Acceptance of Terms</h2>
              <p>
                By adding Baitin (&ldquo;the Bot&rdquo;) to your Discord server or using any of its
                commands, you agree to be bound by these Terms of Service. If you do not agree to
                these terms, please remove the Bot from your server and discontinue use.
              </p>
            </section>

            <section>
              <h2>2. Description of Service</h2>
              <p>
                Baitin is a free, open-source Discord bot that provides fishing gameplay, economy
                systems, pet mechanics, player markets, and competitive events within Discord
                servers. The Bot is provided &ldquo;as is&rdquo; without warranties of any kind.
              </p>
            </section>

            <section>
              <h2>3. User Conduct</h2>
              <p>By using the Bot, you agree not to:</p>
              <ul>
                <li>Exploit bugs, glitches, or unintended mechanics for unfair advantage</li>
                <li>Use automated tools, macros, or scripts to interact with the Bot</li>
                <li>Attempt to disrupt the Bot&apos;s services or infrastructure</li>
                <li>Harass other users through the Bot&apos;s features</li>
                <li>Circumvent any rate limits, cooldowns, or restrictions</li>
                <li>Use the Bot for any illegal purpose</li>
              </ul>
            </section>

            <section>
              <h2>4. Virtual Items &amp; Currency</h2>
              <p>
                All in-game items, currency (coins), fish, pets, and other virtual goods have no
                real-world monetary value. They exist solely within the Bot&apos;s ecosystem.
                Trading, selling, or purchasing virtual items for real money is strictly prohibited.
              </p>
              <p>
                We reserve the right to modify, reset, or remove any virtual items or currency at
                any time without prior notice.
              </p>
            </section>

            <section>
              <h2>5. Data Collection</h2>
              <p>
                The Bot collects and stores certain data necessary for its operation. Please refer
                to our <a href="/privacy" className="text-accent underline">Privacy Policy</a> for
                detailed information about data collection and usage.
              </p>
            </section>

            <section>
              <h2>6. Server Administrator Responsibilities</h2>
              <p>
                Server administrators who add the Bot to their servers are responsible for ensuring
                that their server members are aware the Bot collects usage data as outlined in
                our Privacy Policy. Administrators may configure certain Bot features through
                the provided setup commands.
              </p>
            </section>

            <section>
              <h2>7. Availability &amp; Modifications</h2>
              <p>
                We do not guarantee uninterrupted availability of the Bot. We may modify, suspend,
                or discontinue any aspect of the Bot at any time. We may also update these Terms
                of Service at any time, with continued use constituting acceptance of the updated
                terms.
              </p>
            </section>

            <section>
              <h2>8. Termination</h2>
              <p>
                We reserve the right to restrict or terminate access to the Bot for any user or
                server that violates these terms. Users may remove the Bot from their server at
                any time to discontinue use.
              </p>
            </section>

            <section>
              <h2>9. Limitation of Liability</h2>
              <p>
                To the maximum extent permitted by law, the Bot&apos;s developers shall not be
                liable for any indirect, incidental, special, consequential, or punitive damages
                resulting from your use of the Bot.
              </p>
            </section>

            <section>
              <h2>10. Open Source</h2>
              <p>
                Baitin is released under the Apache-2.0 License. The source code is publicly
                available on{" "}
                <a
                  href="https://github.com/wrlliam/baitin"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-accent underline"
                >
                  GitHub
                </a>
                . Contributions are welcome and subject to the repository&apos;s contribution guidelines.
              </p>
            </section>

            <section>
              <h2>11. Contact</h2>
              <p>
                If you have questions about these Terms of Service, you can reach us through
                our{" "}
                <a
                  href="https://github.com/wrlliam/baitin/issues"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-accent underline"
                >
                  GitHub Issues
                </a>{" "}
                page.
              </p>
            </section>
          </div>
        </article>
      </main>
      <Footer />
    </>
  );
}
