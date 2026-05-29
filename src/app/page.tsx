import { Atmosphere } from "@/components/Atmosphere";
import { Cursor } from "@/components/Cursor";
import { Loader } from "@/components/Loader";
import { Nav } from "@/components/Nav";
import { Hero } from "@/components/Hero";
import { Story } from "@/components/Story";
import { Categories } from "@/components/Categories";
import { Showcase } from "@/components/Showcase";
import { Closer } from "@/components/Closer";
import { Footer } from "@/components/Footer";
import { Confetti } from "@/components/Confetti";
import { SmoothScrollProvider } from "@/components/SmoothScrollProvider";

export default function Home() {
  return (
    <SmoothScrollProvider>
      <Atmosphere />
      <Cursor />
      <Loader />
      <Nav />
      <main id="smooth-content">
        <Hero />
        <Story />
        <Categories />
        <Showcase />
        <Closer />
        <Footer />
      </main>
      <Confetti />
    </SmoothScrollProvider>
  );
}
