import React from "react";

export default function Hero({ isAttacking }) {
  return (
    <div className={`hero ${isAttacking ? "attack" : ""}`}>
      <img src="/hero.png" alt="Hero" className="character" />
    </div>
  );
}
