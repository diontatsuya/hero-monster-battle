import React from 'react';

const BattleLog = ({ logs }) => (
  <div className="mt-6 max-w-md mx-auto text-left bg-black bg-opacity-30 p-4 rounded-lg shadow">
    <h2 className="text-xl mb-2 font-semibold">Battle Log:</h2>
    <ul className="space-y-1 max-h-40 overflow-y-auto">
      {logs.map((entry, i) => (
        <li key={i} className="text-sm">{entry}</li>
      ))}
    </ul>
  </div>
);

export default BattleLog;
