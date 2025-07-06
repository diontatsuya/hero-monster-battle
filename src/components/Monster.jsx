import React from "react";

export default function Monster({ isAttacking }) {
  return (
    <div className={`monster ${isAttacking ? "shake" : ""}`}>
      <img src="/monster.png" alt="Monster" className="character" />
    </div>
  );
}
