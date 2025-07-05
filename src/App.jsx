import { useEffect, useState } from "react";
import { ethers } from "ethers";

const CONTRACT_ADDRESS = "0x7eb0e397fb22958d80d44725f9dc1d2ffd1aac26";
const ABI = [
  "function attack() public",
  "function getStatus(address) public view returns (uint hp, uint kills)",
];

export default function App() {
  const [wallet, setWallet] = useState(null);
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [contract, setContract] = useState(null);
  const [hp, setHp] = useState(null);
  const [kills, setKills] = useState(null);

  // Fungsi untuk connect ke wallet dan ke jaringan Somnia Testnet
  const connectWallet = async () => {
    if (!window.ethereum) {
      alert("MetaMask tidak ditemukan!");
      return;
    }

    const web3Provider = new ethers.BrowserProvider(window.ethereum, "any");

    try {
      const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
      const address = accounts[0];
      setWallet(address);

      // Switch ke jaringan Somnia
      try {
        await window.ethereum.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: "0xc4808" }] // 50312 dalam heksadesimal
        });
      } catch (switchError) {
        // Jika jaringan belum ditambahkan, tambahkan secara otomatis
        if (switchError.code === 4902) {
          await window.ethereum.request({
            method: "wallet_addEthereumChain",
            params: [{
              chainId: "0xc4808",
              chainName: "Somnia Testnet",
              nativeCurrency: {
                name: "Somnia Testnet Token",
                symbol: "STT",
                decimals: 18
              },
              rpcUrls: ["https://dream-rpc.somnia.network/"],
              blockExplorerUrls: ["https://shannon-explorer.somnia.network/"]
            }]
          });
        } else {
          throw switchError;
        }
      }

      const signer = await web3Provider.getSigner();
      const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, signer);

      setProvider(web3Provider);
      setSigner(signer);
      setContract(contract);
      setWallet(address);
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
      const tx = await contract.attack();
      await tx.wait();
      fetchStatus();
    } catch (err) {
      console.error("Gagal menyerang:", err);
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
    <div style={{ padding: "2rem", fontFamily: "Arial, sans-serif", maxWidth: "600px", margin: "auto" }}>
      <h1>⚔️ Hero vs Monster</h1>
      {wallet ? (
        <>
          <p>🦊 Wallet: {wallet}</p>
          <p>❤️ HP: {hp !== null ? hp : "Loading..."}</p>
          <p>💀 Kills: {kills !== null ? kills : "Loading..."}</p>
          <button
            onClick={handleAttack}
            style={{
              padding: "1rem 2rem",
              backgroundColor: "#333",
              color: "#fff",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer"
            }}
          >
            Attack
          </button>
        </>
      ) : (
        <button onClick={connectWallet}>Connect Wallet</button>
      )}
    </div>
  );
}
