import { useState, useEffect } from 'react';
import API from '../api';

export function HeroSection() {
  const [settings, setSettings] = useState<any>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const { data } = await API.get('/settings');
        setSettings(data);
      } catch (err) {
        console.error('Failed to fetch settings:', err);
      }
    };
    fetchSettings();
  }, []);

  const heroImage = settings?.hero?.image || '/images/hero1.png';
  const images = [heroImage, '/images/hero2.png'];
  const title = settings?.hero?.title || '#ART COLLECTION';
  const subtitle = settings?.hero?.subtitle || "Handmade paintings & creative prints you'll love";

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 6000); // Change image every 6 seconds

    return () => clearInterval(interval);
  }, [images.length]);

  return (
    <section className="max-w-7xl mx-auto px-4 md:px-6 py-4 md:py-16">
      <div 
        className="relative rounded-2xl md:rounded-3xl overflow-hidden shadow-lg h-[250px] sm:h-[400px] md:h-[420px] lg:h-[500px]"
      >
        {/* Sliding Images */}
        {images.map((image, index) => (
          <div
            key={index}
            className="absolute inset-0 transition-transform duration-1000 ease-in-out"
            style={{
              transform: `translateX(${(index - currentImageIndex) * 100}%)`,
              backgroundImage: `url(${image})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}
          />
        ))}
        
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-black/30 md:from-black/40 md:to-black/20" />
        
        {/* Content */}
        <div className="relative z-10 h-full flex flex-col items-center justify-center text-center text-white px-4 sm:px-6 md:px-8 py-6 md:py-32">
          <h2 className="text-2xl sm:text-4xl md:text-6xl mb-2 md:mb-6 uppercase leading-tight font-bold" style={{ fontFamily: "'Playfair Display', serif" }}>
            {title}
          </h2>
          <p className="text-xs sm:text-base md:text-xl max-w-sm sm:max-w-xl leading-relaxed opacity-95">
            {subtitle}
          </p>
        </div>
      </div>
    </section>
  );
}
