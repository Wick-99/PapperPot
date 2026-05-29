import { Hero } from "@/components/Hero";
import { Story } from "@/components/Story";
import { Categories } from "@/components/Categories";
import { Showcase } from "@/components/Showcase";
import { Closer } from "@/components/Closer";
import { Footer } from "@/components/Footer";
import { SiteShell } from "@/components/SiteShell";
import { HashScroller } from "@/components/HashScroller";

export default function Home() {
  return (
    <SiteShell>
      <main id="smooth-content">
        <Hero />
        <Story />
        <Categories />
        <Showcase />
        <Closer />
        <Footer />
      </main>
      <HashScroller />
    </SiteShell>
  );
}
