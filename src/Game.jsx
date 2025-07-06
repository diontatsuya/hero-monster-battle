import React, { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import HeroCard from './components/HeroCard';
import MonsterCard from './components/MonsterCard';
import BattleLog from './components/BattleLog';
import { contractABI, contractAddress } from './utils/contract';

const Game = () => {
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [contract, setContract] = useState(null);
  const [account, setAccount] = useState(null);
  const [log, setLog] = useState([]);
  const [heroHP, setHeroHP] = useState(100);
  const [monsterHP, setMonsterHP] = useState(100);

  const connectWallet = async () => {
    if (window.ethereum) {
      const web3Provider = new ethers.BrowserProvider(window.ethereum);
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      const signer = await web3Provider.getSigner();
      const contract = new ethers.Contract(contractAddress, contractABI, signer);

      setProvider(web3Provider);
      setSigner(signer);
      setContract(contract);
      setAccount(accounts[0]);
    }
  };

  const attack = async () => {
    if (!contract || !account) return;
    try {
      const monsterEl = document.getElementById("monster");
      monsterEl?.classList.add("shake");

      const tx = await contract.attack();
      await tx.wait();
      const status = await contract.getStatus(account);
      setHeroHP(Number(status.heroHP));
      setMonsterHP(Number(status.monsterHP));
      setLog((prev) => [`Hero attacked!`, ...prev]);

      setTimeout(() => {
        monsterEl?.classList.remove("shake");
      }, 400);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    connectWallet();
  }, []);

  return (
    <div className="text-center">
      <h1 className="text-4xl font-bold mb-6">⚔️ Hero vs Monster</h1>
      <div className="flex justify-center items-center gap-10 mb-6 flex-wrap">
        <HeroCard hp={heroHP} />
        <MonsterCard hp={monsterHP} />
      </div>
      {heroHP > 0 && monsterHP > 0 ? (
        <button
          onClick={attack}
          className="bg-blue-600 hover:bg-blue-700 px-6 py-2 mt-4 rounded-xl text-white font-semibold shadow-md active:scale-95 transition-transform duration-150"
        >
          Attack!
        </button>
      ) : (
        <p className="text-xl mt-4 font-bold text-yellow-400">
          {heroHP === 0 ? '💀 Game Over!' : '🏆 Victory!'}
        </p>
      )}
      <BattleLog logs={log} />
    </div>
  );
};

export default Game;
