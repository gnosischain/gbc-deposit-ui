"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAccount, useDisconnect, useSwitchChain } from "wagmi";
import { formatEther } from "viem";
import { truncateAddress } from "@/utils/truncateAddress";
import { ArrowRightStartOnRectangleIcon, DocumentDuplicateIcon, CheckIcon, ChevronDownIcon } from "@heroicons/react/24/outline";
import { Select } from "@headlessui/react";
import useDeposit from "@/hooks/use-deposit";
import Deposit from "./deposit";
import Withdrawal from "./withdrawal";
import Validator from "./validator";

export default function Dashboard() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { disconnect } = useDisconnect();
  const { chains, switchChain } = useSwitchChain();
  const { balance, isWrongNetwork } = useDeposit();
  const account = useAccount();
  const [isCopied, setIsCopied] = useState(false);
  const [connectionAttempted, setConnectionAttempted] = useState(false);
  const [address, setAddress] = useState("");
  const [networkMessage, setNetworkMessage] = useState("");
  const [network, setNetwork] = useState("");
  const [networkLoading, setNetworkLoading] = useState(true);

  useEffect(() => {
    if (account.address) setAddress(account.address);
  }, [account.address]);

  useEffect(() => {
    setNetworkMessage(isWrongNetwork ? "Wrong Network. Please connect to Gnosis Chain" : "");
  }, [isWrongNetwork]);

  useEffect(() => {
    if (chains.length > 0) {
      const currentNetwork = chains.find(chain => chain.id === account.chain?.id);
      if (currentNetwork) {
        setNetwork(currentNetwork.name);
      } else {
        setNetwork("Not supported");
      }
      setNetworkLoading(false);
    }
  }, [account.chain?.id, chains]);

  useEffect(() => {
    if (account.isConnecting) {
      setConnectionAttempted(true);
    } else if (connectionAttempted && !account.isConnected) {
      router.push("/");
    }
  }, [account.isConnecting, connectionAttempted, account.isConnected, router]);

  const handleCopyAddress = async () => {
    if (account.address) {
      try {
        await navigator.clipboard.writeText(account.address);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 1000);
      } catch (err) {
        console.error("Failed to copy!", err);
      }
    }
  };

  const handleNetworkChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedNetwork = e.target.value;
    const selectedChain = chains.find(chain => chain.name === selectedNetwork);
    if (selectedChain) {
      switchChain({ chainId: selectedChain.id });
    }
  };

  const renderNetworkOptions = () => {
    const supportedChains = ["Gnosis", "Gnosis Chiado"];
    const currentNetwork = chains.find(chain => chain.id === account.chain?.id)?.name;

    if (currentNetwork && supportedChains.includes(currentNetwork)) {
      return supportedChains.map(option => (
        <option key={option} value={option}>
          {option}
        </option>
      ));
    } else {
      return ["Not supported", ...supportedChains].map(option => (
        <option key={option} value={option}>
          {option}
        </option>
      ));
    }
  };

  return (
    <div className="w-full relative h-[590px] lg:h-[375px] bg-[#F0EBDE] flex flex-col text-black rounded-2xl items-center justify-between p-4">
      <p className="text-red-400 text-sm font-bold rounded-md absolute z-20 top-1">{networkMessage}</p>
      <p className="font-bold text-xl lg:text-2xl">
        {searchParams.get("state") === "validator" ? "Check Validators Status" : "Gnosis Beacon Chain Deposit"}
      </p>
      <div className="w-full flex flex-col-reverse lg:flex-row mt-4">
        <div className="w-full lg:w-2/6 flex flex-col text-base">
          <div
            id="accounts"
            className="w-min bg-[#133629] hidden lg:flex items-center rounded-full mt-4 mb-2 lg:mb-7 text-white p-2 hover:cursor-pointer hover:bg-[#2a4a3e]"
            onClick={handleCopyAddress}
          >
            {truncateAddress(address)}
            {isCopied ? <CheckIcon className="ml-2 h-5 w-5" /> : <DocumentDuplicateIcon className="ml-2 h-5 w-5" />}
          </div>
          <div className="flex flex-col gap-y-4 justify-between items-start mt-4 lg:mt-0">
            <div>
              Balance:
              <p className="font-bold text-xl lg:text-2xl">{Number(formatEther(balance || BigInt(0))).toFixed(3)} GNO</p>
            </div>
            <div className="w-full">
              Network:
              {networkLoading ? (
                <div>Loading network...</div>
              ) : (
                <div className="relative w-36">
                  <Select
                    className="block w-full bg-[#F0EBDE] appearance-none border-b border-[#133629] focus:outline-none p-1"
                    id="network"
                    value={network}
                    onChange={handleNetworkChange}
                  >
                    {renderNetworkOptions()}
                  </Select>
                  <ChevronDownIcon
                    className="group pointer-events-none absolute top-2 right-2.5 size-4"
                    aria-hidden="true"
                  />
                </div>
              )}
            </div>
            <button
              onClick={() => {
                disconnect();
                router.push("/");
              }}
              className="flex w-full items-center justify-center lg:justify-start mt-4 lg:mt-8 underline"
              id="disconnect"
            >
              Sign Out <ArrowRightStartOnRectangleIcon className="ml-1 h-5 w-5" />
            </button>
          </div>
        </div>
        <div className={`w-full ${searchParams.get("state") === "deposit" ? "block" : "hidden"}`}>
          <Deposit />
        </div>
        <div className={`w-full ${searchParams.get("state") === "withdrawal" ? "block" : "hidden"}`}>
          <Withdrawal />
        </div>
        <div className={`w-full ${searchParams.get("state") === "validator" ? "block" : "hidden"}`}>
          <Validator />
        </div>
      </div>
    </div>
  );
}
