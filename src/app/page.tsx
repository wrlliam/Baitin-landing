import Features from "~/components/landing/Features";
import Footer from "~/components/landing/Footer";
import Hero from "~/components/landing/Hero";
import Navbar from "~/components/landing/Navbar";
import TopServers from "~/components/landing/TopServers";
import { getFish, getServers } from "~/lib/api";

export default async function HomePage() {
  const [fishData, serversData] = await Promise.all([
    getFish().catch(() => ({ total: 0, fish: [] })),
    getServers().catch(() => ({ total: 0, servers: [] })),
  ]);

  return (
    <>
      <Navbar />
      <main>
        <Hero fishCount={fishData.total} />
        <TopServers servers={serversData.servers} />
        <Features />
      </main>
      <Footer />
    </>
  );
}
