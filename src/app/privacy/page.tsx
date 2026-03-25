import { type Metadata } from "next";
import Footer from "~/components/landing/Footer";
import Navbar from "~/components/landing/Navbar";

export const metadata: Metadata = {
  title: "Privacy Policy — Baitin 🎣",
  description: "Privacy Policy for the Baitin Discord bot.",
};

export default function PrivacyPage() {
  return (
    <>
      <Navbar />
      <main className="py-16 sm:py-24">
        <article className="mx-auto max-w-3xl px-6">
          <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-accent">Legal</p>
          <h1 className="mb-2 text-3xl font-bold tracking-tight sm:text-4xl">Privacy Policy</h1>
          <p className="mb-10 text-sm text-muted">Last updated: March 24, 2026</p>

          <div className="space-y-8 text-sm leading-relaxed text-muted [&_h2]:mb-3 [&_h2]:text-lg [&_h2]:font-semibold [&_h2]:text-text [&_ul]:ml-4 [&_ul]:list-disc [&_ul]:space-y-1.5 [&_p]:mb-3">
            <section>
              <h2>1. Introduction</h2>
              <p>
                This Privacy Policy explains how Baitin (&ldquo;the Bot&rdquo;, &ldquo;we&rdquo;,
                &ldquo;us&rdquo;) collects, uses, and protects data when you interact with
                the Bot on Discord. We are committed to respecting your privacy and handling
                your data responsibly.
              </p>
            </section>

            <section>
              <h2>2. Data We Collect</h2>
              <p>The Bot collects and stores the following data:</p>
              <ul>
                <li>
                  <strong className="text-text">Discord User ID</strong> — Used to identify your
                  account and maintain your game progress across servers
                </li>
                <li>
                  <strong className="text-text">Discord Server (Guild) ID</strong> — Used to
                  provide server-specific features like leaderboards, events, and settings
                </li>
                <li>
                  <strong className="text-text">Game Data</strong> — Your fishing profile, inventory,
                  coins, XP, level, catch history, pet data, hut data, market listings,
                  achievements, and quest progress
                </li>
                <li>
                  <strong className="text-text">Command Usage</strong> — Which commands you use and
                  when, for cooldown management and abuse prevention
                </li>
                <li>
                  <strong className="text-text">Server Settings</strong> — Configuration set by
                  server administrators (e.g., event announcement channels)
                </li>
              </ul>
            </section>

            <section>
              <h2>3. Data We Do Not Collect</h2>
              <p>The Bot does <strong className="text-text">not</strong> collect:</p>
              <ul>
                <li>Message content (the Bot only processes slash commands)</li>
                <li>Direct messages</li>
                <li>Voice data</li>
                <li>Email addresses or personal information beyond your Discord User ID</li>
                <li>Data from users who do not interact with the Bot</li>
              </ul>
            </section>

            <section>
              <h2>4. How We Use Your Data</h2>
              <p>Collected data is used exclusively to:</p>
              <ul>
                <li>Maintain your game progress and profile</li>
                <li>Provide gameplay features (fishing, economy, pets, markets, etc.)</li>
                <li>Display leaderboards and server-wide statistics</li>
                <li>Manage cooldowns and prevent abuse</li>
                <li>Run events and distribute rewards</li>
                <li>Improve the Bot&apos;s features and performance</li>
              </ul>
            </section>

            <section>
              <h2>5. Data Storage &amp; Security</h2>
              <p>
                Your data is stored in a PostgreSQL database and Redis cache. We implement
                reasonable security measures to protect your data from unauthorized access.
                However, no method of electronic storage is 100% secure, and we cannot
                guarantee absolute security.
              </p>
            </section>

            <section>
              <h2>6. Data Sharing</h2>
              <p>
                We do <strong className="text-text">not</strong> sell, trade, or share your data
                with third parties. Your data is only accessible to the Bot&apos;s developers
                for maintenance and debugging purposes.
              </p>
              <p>
                Certain game data (such as leaderboard rankings, market listings, and fishing
                profiles) is visible to other users within the same Discord server as part of
                the Bot&apos;s normal gameplay functionality.
              </p>
            </section>

            <section>
              <h2>7. Data Retention</h2>
              <p>
                Your game data is retained as long as the Bot is active. If the Bot is removed
                from a server, server-specific settings are deleted. User game data persists
                across servers and is retained unless you request deletion.
              </p>
            </section>

            <section>
              <h2>8. Your Rights</h2>
              <p>You have the right to:</p>
              <ul>
                <li>
                  <strong className="text-text">Access your data</strong> — Use the{" "}
                  <code className="rounded bg-surface-2 px-1.5 py-0.5 text-xs text-text">/profile</code>{" "}
                  command to view your stored game data
                </li>
                <li>
                  <strong className="text-text">Request deletion</strong> — Contact us through
                  GitHub Issues to request complete deletion of your data
                </li>
                <li>
                  <strong className="text-text">Stop data collection</strong> — Simply stop using
                  the Bot. No further data will be collected
                </li>
              </ul>
            </section>

            <section>
              <h2>9. Children&apos;s Privacy</h2>
              <p>
                The Bot is intended for users who meet Discord&apos;s minimum age requirement
                (13 years or older, or the minimum age in your jurisdiction). We do not
                knowingly collect data from children under 13.
              </p>
            </section>

            <section>
              <h2>10. Changes to This Policy</h2>
              <p>
                We may update this Privacy Policy from time to time. Changes will be reflected
                on this page with an updated &ldquo;Last updated&rdquo; date. Continued use of
                the Bot after changes constitutes acceptance of the updated policy.
              </p>
            </section>

            <section>
              <h2>11. Contact</h2>
              <p>
                If you have questions about this Privacy Policy or want to exercise your data
                rights, please contact us through our{" "}
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
