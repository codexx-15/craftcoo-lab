import React from "react";

import { Header } from "./components/Header";
import { AnnouncementBar } from "./components/AnnouncementBar";
import { HeroSection } from "./components/HeroSection";
import { CategoryGrid } from "./components/CategoryGrid";
import { FeaturedProducts } from "./components/FeatureProduct";
import { ConnectSection } from "./components/ConnectSection";
import { FAQSection } from "./components/FAQSection";
import { Footer } from "./components/Footer";

function App() {
  return (
    <div className="min-h-screen bg-[#fdfbfb] relative overflow-hidden">
      
      {/* Grain texture overlay */}
      <div
        className="fixed inset-0 pointer-events-none z-50 opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          backgroundRepeat: "repeat",
          backgroundSize: "200px 200px",
        }}
      />

      {/* Main Content */}
      <div className="relative z-10">

        <AnnouncementBar />
        <Header />

        <main>
          <HeroSection />
          <CategoryGrid />
          <FeaturedProducts />
          <ConnectSection />
          <FAQSection />
        </main>

        <Footer />

      </div>

    </div>
  );
}

export default App;