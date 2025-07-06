import React from 'react';
import monster from '../assets/monster.png';

const MonsterCard = ({ hp }) => (
  <div className="text-center">
    <img src={monster} alt="Monster" className="w-40 mx-auto animate-bounce" />
    <p className="mt-2 text-lg">Monster HP: {hp}</p>
  </div>
);

export default MonsterCard;
