import { useEffect, useState } from "react";
import { ethers } from "ethers";
import Arena from "./components/Arena";
import { ToastContainer, toast } from "react-toastify";
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
  const [animationState, setAnimationState] = useState("");

  const connectWallet = async () => {
    if (!window.ethereum) {
      alert("MetaMask tidak ditemukan!");
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
                nativeCurrency: {
                  name: "Somnia Testnet Token",
                  symbol: "STT",
                  decimals: 18,
                },
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
      const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, signer);
      setContract(contract);
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
      setAnimationState("hero-attack");
      const tx = await contract.attack();
      await tx.wait();
      toast.success("🎉 Serangan berhasil!");
      setAnimationState("monster-hit");
      await fetchStatus();
    } catch (err) {
      toast.error("❌ Gagal menyerang");
      console.error("Gagal menyerang:", err);
    } finally {
      setTimeout(() => {
        setIsAttacking(false);
        setAnimationState("");
      }, 800);
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
          <p className="stat">❤️ HP: <span className="value">{hp !== null ? hp : "Loading..."}</span></p>
          <p className="stat">💀 Kills: <span className="value">{kills !== null ? kills : "Loading..."}</span></p>
          <Arena animationState={animationState} hp={hp} />
          {isAttacking && <p className="attacking">⚔️ Attacking monster...</p>}
          <button className="attack-button" onClick={handleAttack} disabled={isAttacking}>
            {isAttacking ? "Attacking..." : "Attack"}
          </button>
        </>
      ) : (
        <button className="connect-button" onClick={connectWallet}>
          Connect Wallet
        </button>
      )}
      <ToastContainer position="top-center" />
    </div>
  );
}
