import { useEffect, useState } from "react";
import { ethers } from "ethers";

const CONTRACT_ADDRESS = "0x7eb0e397fb22958d80d44725f9dc1d2ffd1aac26";
const ABI = [
  {
    inputs: [],
    name: "attack",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: "address", name: "player", type: "address" },
      { indexed: false, internalType: "uint256", name: "damage", type: "uint256" },
      { indexed: false, internalType: "uint256", name: "remainingHP", type: "uint256" },
    ],
    name: "Attacked",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: "address", name: "player", type: "address" }
    ],
    name: "MonsterDefeated",
    type: "event",
  },
  {
    inputs: [{ internalType: "address", name: "player", type: "address" }],
    name: "getStatus",
    outputs: [
      { internalType: "uint256", name: "hp", type: "uint256" },
      { internalType: "uint256", name: "kills", type: "uint256" }
    ],
    stateMutability: "view",
    type: "function",
  },
];

function App() {
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [contract, setContract] = useState(null);
  const [address, setAddress] = useState("");
  const [hp, setHp] = useState(0);
  const [kills, setKills] = useState(0);
  const [log, setLog] = useState([]);

  useEffect(() => {
    if (window.ethereum) {
      const newProvider = new ethers.BrowserProvider(window.ethereum);
      setProvider(newProvider);
    }
  }, []);

  const connectWallet = async () => {
    if (!provider) return alert("Wallet tidak ditemukan!");
    const accounts = await provider.send("eth_requestAccounts", []);
    const signer = await provider.getSigner();
    const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, signer);
    const addr = await signer.getAddress();

    setSigner(signer);
    setContract(contract);
    setAddress(addr);
    updateStatus(contract, addr);
    listenEvents(contract);
  };

  const updateStatus = async (contract, addr) => {
    const status = await contract.getStatus(addr);
    setHp(Number(status.hp));
    setKills(Number(status.kills));
  };

  const listenEvents = (contract) => {
    contract.on("Attacked", (player, damage, remainingHP) => {
      if (player.toLowerCase() !== address.toLowerCase()) return;
      setLog((prev) => [`🗡️ Damage: ${damage}, 🩸 HP: ${remainingHP}`, ...prev]);
      setHp(Number(remainingHP));
    });

    contract.on("MonsterDefeated", (player) => {
      if (player.toLowerCase() !== address.toLowerCase()) return;
      setLog((prev) => [`🎉 Monster defeated!`, ...prev]);
      setKills((prev) => prev + 1);
    });
  };

  const handleAttack = async () => {
    if (!contract) return;
    const tx = await contract.attack();
    await tx.wait();
  };

  return (
    <main style={{ padding: 20, fontFamily: "sans-serif" }}>
      <h1>🧙 Hero vs Monster 🐲</h1>
      {!address ? (
        <button onClick={connectWallet}>Connect Wallet</button>
      ) : (
        <>
          <p>Wallet: {address}</p>
          <p>❤️ HP: {hp}</p>
          <p>💀 Kills: {kills}</p>
          <button onClick={handleAttack}>⚔️ Attack!</button>
          <ul>
            {log.map((entry, i) => (
              <li key={i}>{entry}</li>
            ))}
          </ul>
        </>
      )}
    </main>
  );
}

export default App;
