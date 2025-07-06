import React from "react";
import heroImg from "../assets/hero.png";
import monsterImg from "../assets/monster.png";

export default function Arena({ isAttacking }) {
  return (
    <div className="arena">
      <img
        src={heroImg}
        alt="Hero"
        className={`hero ${isAttacking ? "shake" : ""}`}
      />
      <img
        src={monsterImg}
        alt="Monster"
        className={`monster ${isAttacking ? "shake" : ""}`}
      />
    </div>
  );
}
