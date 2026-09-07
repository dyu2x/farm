import React from 'react';
import { HeroSlider } from '../components/HeroSlider';
import { FishTankCalculator } from '../components/FishTankCalculator';
import { AboutUsSection } from '../components/AboutUsSection';
import { WhyChooseUs } from '../components/WhyChooseUs';

interface HomePageProps {
  navigate: (path: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ navigate }) => {
  return (
    <div className="space-y-12 sm:space-y-16 pb-12">
      {/* 1. Multiple Hero Images rotating every 10 minutes */}
      <HeroSlider navigate={navigate} />

      {/* 2. Interactive Fish to Tank Calculator on homepage */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <FishTankCalculator navigate={navigate} />
      </div>

      {/* 3. About Us with image slideshow */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AboutUsSection />
      </div>

      {/* 4. Why Choose Us */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <WhyChooseUs />
      </div>
    </div>
  );
};
