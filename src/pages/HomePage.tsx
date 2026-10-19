import React, { useEffect } from 'react';
import { Navbar } from '../components/Navbar';
import { HeroSection } from '../components/HeroSection';
import { PortfolioSection } from '../components/PortfolioSection';
import { ServicesSection } from '../components/ServicesSection';
import { WhyChooseUs } from '../components/WhyChooseUs';
import { BeforeAfterComparison } from '../components/BeforeAfterComparison';
import { EditingProcess } from '../components/EditingProcess';
import { AboutSection } from '../components/AboutSection';
import { TestimonialsSection } from '../components/TestimonialsSection';
import { FAQSection } from '../components/FAQSection';
import { InstagramShowcase } from '../components/InstagramShowcase';
import { ContactSection } from '../components/ContactSection';
import { FloatingWhatsApp } from '../components/FloatingWhatsApp';
import { Footer } from '../components/Footer';
import { settingsService } from '../services/settingsService';

export const HomePage: React.FC = () => {
  // Sync page metadata dynamically with Supabase website settings
  useEffect(() => {
    async function syncSettings() {
      try {
        const settings = await settingsService.getSettings();
        if (settings.seo_title) {
          document.title = settings.seo_title;
        }
        if (settings.seo_description) {
          const metaDesc = document.querySelector('meta[name="description"]');
          if (metaDesc) {
            metaDesc.setAttribute('content', settings.seo_description);
          }
        }
      } catch {
        // Fallback to static
      }
    }
    syncSettings();
  }, []);

  return (
    <div style={{ position: 'relative', minHeight: '100vh', backgroundColor: '#050508' }}>
      {/* Navigation */}
      <Navbar />

      {/* Main Page Flow */}
      <main>
        {/* 1. Hero Section */}
        <HeroSection />

        {/* 2. Featured Video Portfolio (Dynamic from Supabase) */}
        <PortfolioSection />

        {/* 3. Services Section (10 Services) */}
        <ServicesSection />

        {/* 4. Why Choose RYNX Differentiators */}
        <WhyChooseUs />

        {/* 5. Before-and-After Editing Comparison Slider (Auto-hidden if empty) */}
        <BeforeAfterComparison />

        {/* 6. Four-Step Editing Process */}
        <EditingProcess />

        {/* 7. About Studio Section */}
        <AboutSection />

        {/* 8. Testimonials Section (Live from Supabase) */}
        <TestimonialsSection />

        {/* 9. Accessible FAQ Section */}
        <FAQSection />

        {/* 10. Instagram Showcase */}
        <InstagramShowcase />

        {/* 11. Contact & Conversion Form (Saves to Supabase enquiries) */}
        <ContactSection />
      </main>

      {/* Floating WhatsApp Action Button */}
      <FloatingWhatsApp />

      {/* Footer */}
      <Footer />
    </div>
  );
};
