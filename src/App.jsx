import './styles/global.css'; // ✅ pastikan ini ada
import React from 'react';
import Game from './Game';

const App = () => {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <Game />
    </div>
  );
};

export default App;
