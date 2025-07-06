import React from 'react';
import hero from '../assets/hero.png';

const HeroCard = ({ hp }) => (
  <div className="text-center transition-all duration-300">
    <img
      src={hero}
      alt="Hero"
      className="mx-auto max-w-[120px] sm:max-w-[160px] h-auto animate-hero-glow drop-shadow-xl transform scale-x-100"
    />
    <div className="w-32 h-4 bg-gray-800 rounded-full overflow-hidden mx-auto mt-2">
      <div
        className="h-full bg-green-500 transition-all duration-300"
        style={{ width: `${hp}%` }}
      ></div>
    </div>
  </div>
);

export default HeroCard;
