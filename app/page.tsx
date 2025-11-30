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
    <div className="min-h-screen w-full bg-[#050505] text-[#CCFF00] flex flex-col items-center justify-center p-4 font-mono relative overflow-hidden selection:bg-[#CCFF00] selection:text-black">
      {/* Cyber Grid Background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1a1a1a_1px,transparent_1px),linear-gradient(to_bottom,#1a1a1a_1px,transparent_1px)] bg-size-[4rem_4rem] mask-[radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none"></div>

      {/* Floating Cyber Elements */}
      <div className="absolute top-20 left-10 w-24 h-24 bg-[#7000FF] border-2 border-[#CCFF00] shadow-[4px_4px_0px_0px_#CCFF00] z-0 opacity-80 animate-pulse"></div>
      <div className="absolute bottom-20 right-10 w-32 h-32 bg-[#00F0FF] border-2 border-[#CCFF00] shadow-[4px_4px_0px_0px_#CCFF00] z-0 opacity-60"></div>

      <div className="relative z-10 w-full max-w-xl bg-[#111] border-2 border-[#CCFF00] p-8 flex flex-col items-center text-center shadow-[12px_12px_0px_0px_#CCFF00]">
        {/* Pro Badge */}
        {currentAccount && (
          <div className="absolute top-[-15px] right-4">
            <span className="bg-[#7000FF] text-[#CCFF00] text-xs font-bold px-3 py-1 border-2 border-[#CCFF00] shadow-[4px_4px_0px_0px_#CCFF00] uppercase tracking-widest">
              Pro_Node
            </span>
          </div>
        )}

        <div className="mb-8 mt-2 relative">
          <div className="absolute inset-0 bg-[#CCFF00] blur-lg opacity-20 rounded-full"></div>
          <div className="bg-black p-2 border-2 border-[#CCFF00] rounded-full relative z-10">
            <Image
              src={logo}
              alt="Ethereum"
              width={60}
              height={60}
              className="rounded-full opacity-90 grayscale hover:grayscale-0 transition-all duration-300"
            />
          </div>
        </div>

        <h3 className="text-4xl md:text-5xl font-black mb-2 text-white uppercase tracking-tighter">
          ETHER<span className="text-[#CCFF00]">.CHECKER</span>
        </h3>
        <div className="h-1 w-24 bg-[#CCFF00] mb-6"></div>

        {!currentAccount ? (
          <div className="w-full flex flex-col items-center space-y-8 mt-2">
            <div className="w-full p-4 bg-[#1a1a1a] border border-[#CCFF00]/50 text-[#CCFF00] font-medium text-sm font-mono">
              <p className="flex items-center justify-center gap-2">
                <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                [{failMessage}]
              </p>
            </div>

            <div className="relative group p-6 border-2 border-[#333] hover:border-[#CCFF00] transition-colors duration-300 bg-black/50">
              <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(68,68,68,.2)_50%,transparent_75%,transparent_100%)] bg-size-[250%_250%,100%_100%] bg-position-[-100%_0,0_0] bg-no-repeat transition-[background-position_0s_ease] hover:bg-position-[200%_0,0_0] hover:duration-1500"></div>
              <Image
                src={Ethereum}
                alt="Ethereum"
                width={100}
                height={100}
                className="relative z-10 drop-shadow-[0_0_15px_rgba(204,255,0,0.3)]"
              />
            </div>

            <p className="text-gray-400 text-sm max-w-xs">
              {/* Initialize connection sequence... */}
              Connect your Web3 wallet to proceed with balance verification.
            </p>
          </div>
        ) : (
          <div className="w-full mt-4 space-y-6">
            <div className="flex flex-col items-center">
              <div className="flex items-center space-x-2 bg-[#CCFF00] text-black border-2 border-black px-6 py-1 text-sm font-bold mb-6 uppercase tracking-widest">
                <span>Verified_Access</span>
                <span>✓</span>
              </div>

              <p className="text-gray-400 text-sm mb-6 font-mono">
                &gt; Access Granted <br /> &gt; Retrieving node data...
              </p>

              <div className="w-full bg-[#0a0a0a] p-6 border border-[#333] space-y-6 text-left relative overflow-hidden">
                {/* Decorative lines */}
                <div className="absolute top-0 left-0 w-full h-px bg-linear-to-r from-transparent via-[#CCFF00] to-transparent opacity-20"></div>

                <h6 className="text-xs uppercase tracking-widest text-[#7000FF] font-bold mb-4">
                  User_Data_Block
                </h6>

                <div className="space-y-2">
                  <p className="text-xs text-gray-500 uppercase">Target_Address</p>
                  <p className="text-sm font-mono text-[#CCFF00] break-all bg-[#151515] p-3 border border-[#333] hover:border-[#CCFF00] transition-colors">
                    {currentAccount}
                  </p>
                </div>

                <div className="space-y-2">
                  <p className="text-xs text-gray-500 uppercase">Current_Balance</p>
                  <div className="flex items-center justify-between bg-[#151515] p-4 border border-[#333] hover:border-[#CCFF00] transition-colors group">
                    <span className="text-2xl font-bold text-white group-hover:text-[#CCFF00] transition-colors">
                      {balance.split(" ")[0]}
                    </span>
                    <span className="text-xs font-bold text-black bg-[#CCFF00] px-2 py-1">ETH</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Show Connect Wallet button if not connected */}
        {!currentAccount && !connect && (
          <button
            className="w-full py-4 px-6 mt-8 bg-[#CCFF00] hover:bg-[#b3e600] text-black font-black text-lg border-2 border-[#CCFF00] shadow-[6px_6px_0px_0px_#7000FF] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[4px_4px_0px_0px_#7000FF] active:translate-x-[6px] active:translate-y-[6px] active:shadow-none transition-all uppercase tracking-widest"
            onClick={() => cWallet()}
          >
            Initialize_Wallet
          </button>
        )}
      </div>
    </div>
  );
}
