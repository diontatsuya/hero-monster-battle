import React from "react";
import "./Arena.css";

export default function Arena({ hero, monster, isAttacking }) {
  return (
    <div className="arena">
      <div className={`hero ${isAttacking ? "hero-attack" : ""}`}>
        <img src={hero.image} alt="Hero" />
        <div className="hp-bar">
          <div className="hp" style={{ width: `${hero.hp}%` }}></div>
        </div>
      </div>

      <div className={`monster ${isAttacking ? "monster-hit" : ""}`}>
        <img src={monster.image} alt="Monster" />
        <div className="hp-bar">
          <div className="hp" style={{ width: `${monster.hp}%` }}></div>
        </div>
      </div>
    </div>
  );
}
