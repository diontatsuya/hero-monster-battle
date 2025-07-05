import { useEffect, useState } from "react";
import { ethers } from "ethers";
import "./App.css";

const CONTRACT_ADDRESS = "0x7eb0e397fb22958d80d44725f9dc1d2ffd1aac26";
const ABI = [
  "function attack() public",
  "function getStatus(address player) public view returns (uint hp, uint kills)",
];

function App() {
  const [wallet, setWallet] = useState(null);
  const [status, setStatus] = useState({ hp: 0, kills: 0 });

  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        setWallet(accounts[0]);
      } catch (err) {
        alert("Wallet connection rejected");
      }
    } else {
      alert("Please install Metamask");
    }
  };

  const fetchStatus = async () => {
    if (!wallet || !window.ethereum) return;
    const provider = new ethers.BrowserProvider(window.ethereum);
    const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, provider);
    const [hp, kills] = await contract.getStatus(wallet);
    setStatus({ hp: Number(hp), kills: Number(kills) });
  };

  const attack = async () => {
    if (!wallet || !window.ethereum) return;
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, signer);
    const tx = await contract.attack();
    await tx.wait();
    fetchStatus();
  };

  useEffect(() => {
    if (wallet) fetchStatus();
  }, [wallet]);

  return (
    <div className="container">
      <h1>⚔️ Hero vs Monster</h1>
      {wallet ? (
        <>
          <p>🦊 Wallet: {wallet}</p>
          <p>❤️ HP: {status.hp}</p>
          <p>💀 Kills: {status.kills}</p>
          <button onClick={attack}>Attack</button>
        </>
      ) : (
        <button onClick={connectWallet}>Connect Wallet</button>
      )}
    </div>
  );
}

export default App;
