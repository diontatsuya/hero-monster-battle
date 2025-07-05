import { useEffect, useState } from "react";
import { usePrivy, useWallets } from "@privy-io/react-auth";
import { ethers } from "ethers";

const CONTRACT_ADDRESS = "0x7eb0e397fb22958d80d44725f9dc1d2ffd1aac26";
const SOMNIA_CHAIN_ID = 50312;
const SOMNIA_RPC = "https://dream-rpc.somnia.network/";

const ABI = [
  "function attack() public",
  "function getStatus(address) public view returns (uint hp, uint kills)",
  "event Attacked(address indexed hero, uint damage)",
  "event MonsterDefeated(address indexed hero)"
];

export default function App() {
  const { ready, authenticated, login, logout } = usePrivy();
  const { wallets } = useWallets();
  const wallet = wallets[0];

  const [address, setAddress] = useState("");
  const [hp, setHp] = useState(0);
  const [kills, setKills] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchStatus = async () => {
      if (!wallet) return;
      const provider = new ethers.JsonRpcProvider(SOMNIA_RPC);
      const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, provider);
      const [userHp, userKills] = await contract.getStatus(wallet.address);
      setAddress(wallet.address);
      setHp(Number(userHp));
      setKills(Number(userKills));
    };
    fetchStatus();
  }, [wallet]);

  const handleAttack = async () => {
    if (!wallet) return alert("Please connect your wallet first.");
    setLoading(true);
    try {
      const injected = new ethers.BrowserProvider(window.ethereum);
      const network = await injected.getNetwork();
      if (network.chainId !== BigInt(SOMNIA_CHAIN_ID)) {
        alert("Please switch your wallet to Somnia Testnet (Chain ID 50312).");
        setLoading(false);
        return;
      }

      const signer = await injected.getSigner();
      const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, signer);
      const tx = await contract.attack();
      await tx.wait();

      const [userHp, userKills] = await contract.getStatus(wallet.address);
      setHp(Number(userHp));
      setKills(Number(userKills));
      alert("Attack successful!");
    } catch (err) {
      console.error(err);
      alert("Attack failed.");
    }
    setLoading(false);
  };

  return (
    <div style={{ fontFamily: "monospace", padding: "20px", textAlign: "center" }}>
      <h1>⚔️ Hero vs Monster</h1>
      {!authenticated ? (
        <button onClick={login}>Login with Privy</button>
      ) : (
        <div>
          <p>🦊 Wallet: {address}</p>
          <p>❤️ HP: {hp}</p>
          <p>💀 Kills: {kills}</p>
          <button onClick={handleAttack} disabled={loading}>
            {loading ? "Attacking..." : "Attack"}
          </button>
          <br />
          <button onClick={logout} style={{ marginTop: "10px" }}>
            Log Out
          </button>
        </div>
      )}
    </div>
  );
}
