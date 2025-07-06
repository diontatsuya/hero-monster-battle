import React from 'react';
import hero from '../assets/hero.png';

const HeroCard = ({ hp }) => (
  <div className="text-center w-1/2 sm:w-1/3">
    <img src={hero} alt="Hero" className="w-[120px] sm:w-[160px] mx-auto animate-pulse" />
    <p className="mt-2 text-lg">Hero HP: {hp}</p>
  </div>
);

export default HeroCard;
