import React from 'react';
import hero from '../assets/hero.png';

const HeroCard = ({ hp }) => (
  <div className="text-center">
    <img
      src={hero}
      alt="Hero"
      className="mx-auto max-w-[100px] sm:max-w-[160px] h-auto animate-pulse"
    />
    <p className="mt-2 text-lg">Hero HP: {hp}</p>
  </div>
);

export default HeroCard;
