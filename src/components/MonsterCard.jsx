import React from 'react';
import monster from '../assets/monster.png';

const MonsterCard = ({ hp }) => (
  <div className="text-center transition-all duration-300">
    <img
      id="monster"
      src={monster}
      alt="Monster"
      className="mx-auto max-w-[120px] sm:max-w-[160px] h-auto animate-monster-bounce drop-shadow-xl transform scale-x-[-1]"
    />
    <div className="w-32 h-4 bg-gray-800 rounded-full overflow-hidden mx-auto mt-2">
      <div
        className="h-full bg-red-500 transition-all duration-300"
        style={{ width: `${hp}%` }}
      ></div>
    </div>
  </div>
);

export default MonsterCard;
