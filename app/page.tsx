import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Workflow from "./components/Workflow";
import Pricing from "./components/Pricing";
import FAQ from "./components/FAQ";
import Footer from "./components/Footer";

export default function Home() {
  return (
    <main className="w-full bg-[#F4F1EB]">
      <Navbar />
      <Hero />
      <Workflow />
      <Pricing />
      <FAQ />
      <Footer />
    </main>
  );
}
