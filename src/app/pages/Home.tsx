import React from "react";
import { motion } from "motion/react";

import { HeroSection } from "../components/HeroSection";
import { CategoryGrid } from "../components/CategoryGrid";
import { FeaturedProducts } from "../components/FeatureProduct";
import { ConnectSection } from "../components/ConnectSection";
import { FAQSection } from "../components/FAQSection";

import PageWrapper from "../components/PageWrapper";

const SectionWrapper = ({ children }: { children: React.ReactNode }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-100px" }}
    transition={{ duration: 0.8, ease: "easeOut" }}
  >
    {children}
  </motion.div>
);

const Home = () => {
  return (
    <PageWrapper>
      <main>
        <HeroSection />
        
        <SectionWrapper>
          <CategoryGrid />
        </SectionWrapper>
        
        <SectionWrapper>
          <FeaturedProducts />
        </SectionWrapper>
        
        <SectionWrapper>
          <ConnectSection />
        </SectionWrapper>
        
        <SectionWrapper>
          <FAQSection />
        </SectionWrapper>
      </main>
    </PageWrapper>
  );
};

export default Home;
