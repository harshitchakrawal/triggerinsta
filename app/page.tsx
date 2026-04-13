import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Workflow from "./components/Workflow";
import Footer from "./components/Footer";

export default function Home() {
  return (
    <main className="w-full bg-[#F4F1EB]">
      <Navbar />
      <Hero />
      <Workflow />
      <Footer />
    </main>
  );
}
