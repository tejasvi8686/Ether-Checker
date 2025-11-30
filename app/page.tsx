"use client";
import { useState, useEffect } from "react";
import { ethers } from "ethers";
import Image from "next/image";

import logo from "@/logo.jpg";
import Ethereum from "@/Ethereum.png";

// Extend Window interface for TypeScript
declare global {
  interface Window {
    ethereum?: {
      request: (args: {
        method: string;
        params?: unknown[];
      }) => Promise<unknown>;
      on: (event: string, handler: (accounts: string[]) => void) => void;
      removeListener: (
        event: string,
        handler: (accounts: string[]) => void
      ) => void;
    };
  }
}

export default function Home() {
  const [currentAccount, setCurrentAccount] = useState<string | false>(false);
  const [connect, setConnect] = useState(false);
  const [balance, setBalance] = useState("");

  const failMessage = "Please install MetaMask! & Connect to the wallet";
  const successMessage = "You account is connected successfully to metamask";

  const INFURA_ID = "57e4da4bad174bbc899a9928142ffdf5";

  const checkIfWalletIsConnected = async () => {
    if (typeof window === "undefined" || !window.ethereum) {
      console.log(failMessage);
      return;
    }

    try {
      const accounts = (await window.ethereum.request({
        method: "eth_accounts",
      })) as string[];

      if (accounts.length) {
        console.log("accounts", accounts);
        setCurrentAccount(accounts[0]);
        setConnect(true);
      } else {
        console.log("No accounts found");
        setConnect(false);
      }

      // Create provider only when needed and client-side
      const provider = new ethers.JsonRpcProvider(
        `https://mainnet.infura.io/v3/${INFURA_ID}`
      );

      const address = "0xdadB0d80178819F2319190D340ce9A924f783711";
      const balanceResult = await provider.getBalance(address);
      const balanceInEth = ethers.formatEther(balanceResult);

      console.log("balance", balanceInEth);
      setBalance(balanceInEth + " ETH");
    } catch (error) {
      console.error("Error connecting to wallet:", error);
    }
  };

  useEffect(() => {
    (async () => {
      await checkIfWalletIsConnected();
    })();
  }, []);

  const cWallet = async () => {
    if (!window.ethereum) return console.log(failMessage);

    const accounts = (await window.ethereum.request({
      method: "eth_requestAccounts",
    })) as string[];

    setCurrentAccount(accounts[0]);

    window.location.reload();
  };

  useEffect(() => {
    if (typeof window === "undefined" || !window.ethereum) {
      return;
    }

    const handleAccountsChanged = async (accounts: string[]) => {
      if (accounts.length) {
        setCurrentAccount(accounts[0]);
        setConnect(true);
        // Refresh balance when account changes
        await checkIfWalletIsConnected();
      } else {
        setCurrentAccount(false);
        setConnect(false);
        window.location.reload();
      }
    };

    window.ethereum.on("accountsChanged", handleAccountsChanged);

    // Cleanup function to remove event listener
    return () => {
      if (window.ethereum && window.ethereum.removeListener) {
        window.ethereum.removeListener(
          "accountsChanged",
          handleAccountsChanged
        );
      }
    };
  }, []);

  return (
    <div className="min-h-screen w-full bg-[#0f172a] text-white flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Background Gradients */}
      <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-purple-600/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] bg-blue-600/20 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative z-10 w-full max-w-md bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl p-8 shadow-[0_0_40px_rgba(0,0,0,0.3)] flex flex-col items-center text-center">
        {/* Pro Badge */}
        {currentAccount && (
          <div className="absolute top-4 right-4">
            <span className="bg-linear-to-r from-yellow-400 to-orange-500 text-black text-xs font-bold px-3 py-1 rounded-full shadow-lg">
              PRO
            </span>
          </div>
        )}

        <div className="mb-6 p-1 rounded-full bg-linear-to-b from-white/20 to-transparent">
          <div className="bg-black/50 rounded-full p-2">
            <Image
              src={logo}
              alt="Ethereum"
              width={60}
              height={60}
              className="rounded-full"
            />
          </div>
        </div>

        <h3 className="text-3xl font-bold mb-2 bg-clip-text text-transparent bg-linear-to-r from-blue-400 via-purple-400 to-pink-400">
          Check Ether
        </h3>

        {!currentAccount ? (
          <div className="w-full flex flex-col items-center space-y-6 mt-4">
            <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-200 text-sm">
              <p>{failMessage}</p>
            </div>

            <div className="relative group">
              <div className="absolute -inset-1 bg-linear-to-r from-blue-600 to-purple-600 rounded-full blur opacity-25 group-hover:opacity-75 transition duration-200"></div>
              <Image
                src={Ethereum}
                alt="Ethereum"
                width={120}
                height={120}
                className="relative drop-shadow-2xl transform group-hover:scale-110 transition-transform duration-300"
              />
            </div>

            <p className="text-gray-400 text-sm max-w-xs">
              Welcome to the Ether account balance checker. Connect your wallet
              to proceed.
            </p>
          </div>
        ) : (
          <div className="w-full mt-4 space-y-6">
            <div className="flex flex-col items-center">
              <div className="flex items-center space-x-2 text-green-400 bg-green-400/10 px-4 py-1 rounded-full text-sm font-medium mb-4">
                <span>Verified</span>
                <span>&#10004;</span>
              </div>

              <p className="text-gray-400 text-sm mb-6">
                Ether account and balance Checker <br /> View your account
                details below
              </p>

              <div className="w-full bg-black/20 rounded-2xl p-6 border border-white/5 space-y-4 text-left">
                <h6 className="text-xs uppercase tracking-wider text-gray-500 font-bold mb-4">
                  Your Ether Details
                </h6>

                <div className="space-y-1">
                  <p className="text-xs text-gray-400">Account</p>
                  <p className="text-sm font-mono text-white break-all bg-white/5 p-2 rounded border border-white/10">
                    {currentAccount}
                  </p>
                </div>

                <div className="space-y-1">
                  <p className="text-xs text-gray-400">Balance</p>
                  <div className="flex items-baseline space-x-2">
                    <span className="text-2xl font-bold text-transparent bg-clip-text bg-linear-to-r from-green-400 to-emerald-400">
                      {balance.split(" ")[0]}
                    </span>
                    <span className="text-sm text-gray-500">ETH</span>
                  </div>
                </div>
              </div>

              <button
                className="mt-6 w-full py-3 px-6 bg-white/10 hover:bg-white/20 border border-white/10 text-white font-semibold rounded-xl transition-all"
                onClick={() => {}}
              >
                Ether Account Details
              </button>
            </div>
          </div>
        )}

        {/* Show Connect Wallet button if not connected */}
        {!currentAccount && !connect && (
          <button
            className="w-full py-3 px-6 mt-4 bg-linear-to-r from-blue-600 to-violet-600 hover:from-blue-500 hover:to-violet-500 text-white font-bold rounded-xl transition-all transform hover:scale-[1.02] shadow-lg shadow-blue-500/25 active:scale-95"
            onClick={() => cWallet()}
          >
            Connect Wallet
          </button>
        )}
      </div>
    </div>
  );
}
