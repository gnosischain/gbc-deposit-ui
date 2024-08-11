"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAccount, useDisconnect, useSwitchChain } from "wagmi";
import { formatEther } from "viem";
import { truncateAddress } from "@/utils/truncateAddress";
import {
  ArrowRightStartOnRectangleIcon,
  DocumentDuplicateIcon,
  CheckIcon,
  ChevronDownIcon,
} from "@heroicons/react/24/outline";
import {
  Listbox,
  ListboxButton,
  ListboxOption,
  ListboxOptions,
} from "@headlessui/react";
import useDeposit from "@/hooks/use-deposit";
import Deposit from "./deposit";
import Withdrawal from "./withdrawal";
import Validator from "./validator";
import useBalance from "@/hooks/use-balance";

export default function Dashboard() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { disconnect } = useDisconnect();
  const { chains, switchChain } = useSwitchChain();
  const { balance } = useBalance();
  const { isWrongNetwork } = useDeposit();
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
    setNetworkMessage(
      isWrongNetwork ? "Wrong Network. Please connect to Gnosis Chain" : ""
    );
  }, [isWrongNetwork]);

  useEffect(() => {
    if (chains.length > 0) {
      const currentNetwork = chains.find(
        (chain) => chain.id === account.chain?.id
      );
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

  const handleNetworkChange = (value: string) => {
    const selectedChain = chains.find((chain) => chain.name === value);
    if (selectedChain) {
      switchChain({ chainId: selectedChain.id });
    }
  };

  const renderNetworkOptions = () => {
    const supportedChains = ["Gnosis", "Gnosis Chiado"];
    const currentNetwork = chains.find(
      (chain) => chain.id === account.chain?.id
    )?.name;

    if (currentNetwork && supportedChains.includes(currentNetwork)) {
      return supportedChains.map((option) => (
        <ListboxOption
          key={option}
          value={option}
          className="group flex cursor-default items-center gap-2 rounded-lg py-1.5 px-3 select-none data-[focus]:bg-[#F0EBDE]/50"
        >
          {option}
        </ListboxOption>
      ));
    } else {
      return ["Not supported", ...supportedChains].map((option) => (
        <ListboxOption
          key={option}
          value={option}
          className="group flex cursor-default items-center gap-2 rounded-lg py-1.5 px-3 select-none data-[focus]:bg-[#F0EBDE]/50"
        >
          {option}
        </ListboxOption>
      ));
    }
  };

  return (
    <div className="w-full relative h-[590px] lg:h-[375px] bg-[#F0EBDE] flex flex-col text-black rounded-2xl items-center justify-between p-4">
      <p className="text-red-400 text-sm font-bold rounded-md absolute z-20 top-1">
        {networkMessage}
      </p>
      <p className="font-bold text-xl lg:text-2xl">
        {searchParams.get("state") === "validator"
          ? "Check Validators Status"
          : "Gnosis Beacon Chain Deposit"}
      </p>
      <div className="w-full h-full flex flex-col-reverse lg:flex-row mt-4">
        <div className="w-full lg:w-2/6 flex flex-col text-base">
          <div
            id="accounts"
            className="w-min bg-[#133629] hidden lg:flex items-center rounded-full mt-4 mb-2 lg:mb-7 text-white p-2 hover:cursor-pointer hover:bg-[#2a4a3e]"
            onClick={handleCopyAddress}
          >
            {truncateAddress(address)}
            {isCopied ? (
              <CheckIcon className="ml-2 h-5 w-5" />
            ) : (
              <DocumentDuplicateIcon className="ml-2 h-5 w-5" />
            )}
          </div>
          <div className="flex flex-col gap-y-4 justify-between items-start mt-4 lg:mt-0">
            <div>
              Balance:
              <p className="font-bold text-xl lg:text-2xl">
                {Number(formatEther(balance || BigInt(0))).toFixed(3)} GNO
              </p>
            </div>
            <div className="w-full">
              Network:
              {networkLoading ? (
                <div>Loading network...</div>
              ) : (
                <div className="relative w-36">
                  <Listbox value={network} onChange={handleNetworkChange}>
                    <ListboxButton
                      id="network"
                      className="flex items-center justify-between w-full rounded-lg bg-[#e6e1d3] p-1.5 font-bold text-nowrap"
                    >
                      {network}
                      <ChevronDownIcon
                        className="group pointer-events-none ml-2 size-4"
                        aria-hidden="true"
                      />
                    </ListboxButton>
                    <ListboxOptions
                      anchor="bottom"
                      transition
                      className="w-[var(--button-width)] rounded-xl mt-1 text-black shadow-md bg-[#e6e1d3] p-1 [--anchor-gap:var(--spacing-1)] focus:outline-none transition duration-100 ease-in data-[leave]:data-[closed]:opacity-0"
                    >
                      {renderNetworkOptions()}
                    </ListboxOptions>
                  </Listbox>
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
              Sign Out{" "}
              <ArrowRightStartOnRectangleIcon className="ml-1 h-5 w-5" />
            </button>
          </div>
        </div>
        <div
          className={`w-full h-full ${
            searchParams.get("state") === "deposit" ? "block" : "hidden"
          }`}
        >
          <Deposit />
        </div>
        <div
          className={`w-full h-full ${
            searchParams.get("state") === "withdrawal" ? "block" : "hidden"
          }`}
        >
          <Withdrawal />
        </div>
        <div
          className={`w-full h-full ${
            searchParams.get("state") === "validator" ? "block" : "hidden"
          }`}
        >
          <Validator />
        </div>
      </div>
    </div>
  );
}
