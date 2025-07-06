import React from 'react';
import monster from '../assets/monster.png';

const MonsterCard = ({ hp }) => (
  <div className="text-center">
    <img
      src={monster}
      alt="Monster"
      className="mx-auto max-w-[100px] sm:max-w-[160px] h-auto animate-bounce"
    />
    <p className="mt-2 text-lg">Monster HP: {hp}</p>
  </div>
);

export default MonsterCard;
