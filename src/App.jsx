import { useEffect, useState } from "react";
import { ethers } from "ethers";
import { ToastContainer, toast } from "react-toastify";
import { motion } from "framer-motion";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";

const CONTRACT_ADDRESS = "0x7eb0e397fb22958d80d44725f9dc1d2ffd1aac26";
const ABI = [
  "function attack() public",
  "function getStatus(address) public view returns (uint hp, uint kills)",
];

export default function App() {
  const [wallet, setWallet] = useState(null);
  const [contract, setContract] = useState(null);
  const [hp, setHp] = useState(null);
  const [kills, setKills] = useState(null);
  const [isAttacking, setIsAttacking] = useState(false);

  const connectWallet = async () => {
    if (!window.ethereum) {
      alert("MetaMask atau wallet tidak ditemukan!");
      return;
    }
    const provider = new ethers.BrowserProvider(window.ethereum, "any");
    try {
      const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
      const address = accounts[0];
      setWallet(address);
      try {
        await window.ethereum.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: "0xc488" }],
        });
      } catch (switchError) {
        if (switchError.code === 4902) {
          await window.ethereum.request({
            method: "wallet_addEthereumChain",
            params: [
              {
                chainId: "0xc488",
                chainName: "Somnia Testnet",
                nativeCurrency: { name: "Somnia", symbol: "STT", decimals: 18 },
                rpcUrls: ["https://dream-rpc.somnia.network/"],
                blockExplorerUrls: ["https://shannon-explorer.somnia.network/"],
              },
            ],
          });
        } else {
          throw switchError;
        }
      }
      const signer = await provider.getSigner();
      const instance = new ethers.Contract(CONTRACT_ADDRESS, ABI, signer);
      setContract(instance);
    } catch (err) {
      console.error("Gagal connect wallet:", err);
    }
  };

  const fetchStatus = async () => {
    if (!contract || !wallet) return;
    try {
      const [hp, kills] = await contract.getStatus(wallet);
      setHp(Number(hp));
      setKills(Number(kills));
    } catch (err) {
      console.error("Gagal mengambil status:", err);
    }
  };

  const handleAttack = async () => {
    if (!contract) return;
    try {
      setIsAttacking(true);
      const tx = await contract.attack();
      await tx.wait();
      await fetchStatus();
      toast.success("🎯 Serangan berhasil!");
    } catch (err) {
      toast.error("❌ Gagal menyerang");
      console.error("Gagal menyerang:", err);
    } finally {
      setIsAttacking(false);
    }
  };

  useEffect(() => {
    connectWallet();
  }, []);

  useEffect(() => {
    if (contract && wallet) {
      fetchStatus();
    }
  }, [contract, wallet]);

  return (
    <div className="container">
      <h1 className="title">⚔️ Hero vs Monster</h1>
      {wallet ? (
        <>
          <p className="wallet">🦊 Wallet: {wallet}</p>
          <div className="stat">❤️ HP: <progress value={hp} max="100"></progress> {hp}</div>
          <div className="stat">💀 Kills: {kills}</div>
          <motion.button
            className="attack-button"
            onClick={handleAttack}
            whileTap={{ scale: 0.95 }}
            disabled={isAttacking}
          >
            {isAttacking ? "Attacking..." : "Attack"}
          </motion.button>
        </>
      ) : (
        <button className="connect-button" onClick={connectWallet}>Connect Wallet</button>
      )}
      <ToastContainer position="top-center" />
    </div>
  );
}
