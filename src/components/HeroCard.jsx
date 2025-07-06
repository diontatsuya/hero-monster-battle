import React from 'react';
import hero from '../assets/hero.png';

const HeroCard = ({ hp }) => (
  <div className="text-center transition-all duration-300">
    <img
      src={hero}
      alt="Hero"
      className="mx-auto max-w-[100px] sm:max-w-[160px] h-auto animate-hero-glow drop-shadow-lg"
    />
    <p className="mt-2 text-lg font-semibold text-green-300 transition duration-300">
      Hero HP: {hp}
    </p>
  </div>
);

export default HeroCard;
