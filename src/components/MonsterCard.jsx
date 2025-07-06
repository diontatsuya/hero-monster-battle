import React from 'react';
import monster from '../assets/monster.png';

const MonsterCard = ({ hp }) => (
  <div className="text-center transition-all duration-300">
    <img
      src={monster}
      alt="Monster"
      className="mx-auto max-w-[100px] sm:max-w-[160px] h-auto animate-monster-bounce drop-shadow-lg"
    />
    <p className="mt-2 text-lg font-semibold text-red-300 transition duration-300">
      Monster HP: {hp}
    </p>
  </div>
);

export default MonsterCard;
