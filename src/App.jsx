import { useEffect, useState } from "react";
import { usePrivy, useWallets } from "@privy-io/react-auth";
import { ethers } from "ethers";
import abi from "./abi/HeroMonsterBattle.json";

const CONTRACT_ADDRESS = "0x7eb0e397fb22958d80d44725f9dc1d2ffd1aac26";

export default function App() {
  const { ready, authenticated, login, logout } = usePrivy();
  const { wallets } = useWallets();
  const wallet = wallets[0];
  const [hp, setHP] = useState(null);
  const [kills, setKills] = useState(null);
  const [loading, setLoading] = useState(false);

  const getStatus = async () => {
    if (!wallet?.address) return;
    const provider = new ethers.BrowserProvider(wallet);
    const contract = new ethers.Contract(CONTRACT_ADDRESS, abi, provider);
    const [hp, kills] = await contract.getStatus(wallet.address);
    setHP(hp.toString());
    setKills(kills.toString());
  };

  const attack = async () => {
    if (!wallet) return;
    setLoading(true);
    try {
      const provider = new ethers.BrowserProvider(wallet);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(CONTRACT_ADDRESS, abi, signer);
      const tx = await contract.attack();
      await tx.wait();
      await getStatus();
    } catch (err) {
      console.error("Attack failed:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (authenticated) {
      getStatus();
    }
  }, [authenticated]);

  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold mb-4">⚔️ Hero vs Monster</h1>
      {!ready ? (
        <p>Loading Privy...</p>
      ) : authenticated ? (
        <div>
          <p><strong>Wallet:</strong> {wallet?.address}</p>
          <p><strong>HP:</strong> {hp}</p>
          <p><strong>Kills:</strong> {kills}</p>
          <button
            onClick={attack}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            disabled={loading}
          >
            {loading ? "Attacking..." : "Attack!"}
          </button>
          <button onClick={logout} className="mt-4 ml-4 text-sm text-gray-500 underline">Log Out</button>
        </div>
      ) : (
        <button
          onClick={login}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Connect Wallet
        </button>
      )}
    </main>
  );
}
