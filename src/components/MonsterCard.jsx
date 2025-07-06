import React from 'react';
import monster from '../assets/monster.png';

const MonsterCard = ({ hp }) => (
  <div className="text-center w-1/2 sm:w-1/3">
    <img src={monster} alt="Monster" className="w-[120px] sm:w-[160px] mx-auto animate-bounce" />
    <p className="mt-2 text-lg">Monster HP: {hp}</p>
  </div>
);

export default MonsterCard;
