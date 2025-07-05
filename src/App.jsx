import { useEffect, useState } from "react";
import { ethers } from "ethers";

const CONTRACT_ADDRESS = "0x7eb0e397fb22958d80d44725f9dc1d2ffd1aac26";
const ABI = [
  {
    "inputs": [],
    "name": "attack",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "address", "name": "player", "type": "address" }
    ],
    "name": "getStatus",
    "outputs": [
      { "internalType": "uint256", "name": "hp", "type": "uint256" },
      { "internalType": "uint256", "name": "kills", "type": "uint256" }
    ],
    "stateMutability": "view",
    "type": "function"
  }
];

function App() {
  const [wallet, setWallet] = useState("");
  const [status, setStatus] = useState({ hp: 0, kills: 0 });
  const [provider, setProvider] = useState(null);
  const [contract, setContract] = useState(null);

  const connectWallet = async () => {
    if (window.ethereum) {
      const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
      setWallet(accounts[0]);
      const _provider = new ethers.BrowserProvider(window.ethereum);
      setProvider(_provider);
      const signer = await _provider.getSigner();
      const _contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, signer);
      setContract(_contract);
    } else {
      alert("Wallet not found. Please install MetaMask or OKX Wallet.");
    }
  };

  const attack = async () => {
    if (!contract) return;
    const tx = await contract.attack();
    await tx.wait();
    getStatus(); // refresh status after attack
  };

  const getStatus = async () => {
    if (!contract || !wallet) return;
    const data = await contract.getStatus(wallet);
    setStatus({ hp: Number(data.hp), kills: Number(data.kills) });
  };

  useEffect(() => {
    if (wallet && contract) {
      getStatus();
    }
  }, [wallet, contract]);

  return (
    <div style={{ padding: "2rem", fontFamily: "monospace" }}>
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
