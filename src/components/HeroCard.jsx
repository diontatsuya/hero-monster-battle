import React from 'react';
import hero from '../assets/hero.png';

const HeroCard = ({ hp }) => (
  <div className="text-center">
    <img src={hero} alt="Hero" className="w-40 mx-auto animate-pulse" />
    <p className="mt-2 text-lg">Hero HP: {hp}</p>
  </div>
);

export default HeroCard;
