"use client";

import useDeposit from "@/hooks/use-deposit";
import { truncateAddress } from "@/utils/truncateAddress";
import { InformationCircleIcon } from "@heroicons/react/20/solid";
import { ArrowRightStartOnRectangleIcon, DocumentDuplicateIcon } from "@heroicons/react/24/outline";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { formatEther } from "viem";
import { useAccount, useAccountEffect, useDisconnect } from "wagmi";
import { FileRejection } from "react-dropzone";

export default function Withdrawal() {
  const account = useAccount();
  const { disconnect } = useDisconnect();
  const router = useRouter();
  const { deposit, txData: depositTxData, depositData, setDepositData, balance } = useDeposit();
  const onDrop = useCallback(async (acceptedFiles: File[], rejectedFiles: FileRejection[]) => {
    const reader = new FileReader();
    reader.onload = async (event) => {
      const result = event.target?.result as string;
      if (result) {
        setDepositData(result, acceptedFiles[0].name);
      }
    };
    reader.readAsText(acceptedFiles[0]);
  }, []);
  const { getRootProps, getInputProps } = useDropzone({ onDrop, accept: { "application/json": [] }, maxFiles: 1 });

  useAccountEffect({
    onDisconnect() {
      router.push("/");
    },
  });

  return (
    <div className="w-full h-[515px] lg:h-[375px] bg-[#F0EBDE] flex flex-col text-black rounded-2xl items-center px-4 py-6">
      <p className="font-bold text-xl lg:text-2xl">Gnosis Beacon Chain Deposit</p>
      <div className="w-full flex mt-4">
        <div className="w-full lg:w-2/6 flex flex-col text-base">
          <div className="w-min bg-[#133629] flex items-center rounded-full mt-4 mb-2 lg:mb-7 text-white p-2 hover:cursor-pointer">
            {truncateAddress(account.address ? account.address : "")} <DocumentDuplicateIcon className="ml-2 h-5 w-5" />
          </div>
          <div className="w-full flex lg:hidden w-4/6 bg-[#FFFFFFB2] h-[280px] p-6 flex-col justify-center items-center rounded-2xl hover:cursor-pointer">
            Claimable balance:
            <div className="flex font-bold items-center my-8">XX GNOS</div>
            <div className="bg-[#DD7143] px-6 py-2 rounded-full text-white text-lg font-semibold">Claim</div>
          </div>
          <div className="flex flex-col justify-between items-start mt-2 lg:mt-0">
            <div className="flex items-center gap-x-2 lg:block">
              Balance:
              <p className="font-bold text-2xl lg:text-4xl lg:mb-7">{Math.round(Number(formatEther(balance || BigInt(0))))} GNO</p>
            </div>
            <div className="flex items-center gap-x-2 lg:block">
              Network:
              <p className="font-bold text-lg">{account.chain?.name}</p>
            </div>
            <button
              onClick={() => {
                disconnect();
                router.push("/");
              }}
              className="flex items-center lg:mt-8 underline"
            >
              Sign Out <ArrowRightStartOnRectangleIcon className="ml-1 h-5 w-5" />
            </button>
          </div>
        </div>
        <div className="hidden w-4/6 bg-[#FFFFFFB2] h-[280px] p-6 lg:flex flex-col justify-center items-center rounded-2xl hover:cursor-pointer">
          Claimable balance:
          <div className="flex font-bold items-center my-8">XX GNOS</div>
          <div className="bg-[#DD7143] px-6 py-2 rounded-full text-white text-lg font-semibold">Claim</div>
        </div>
      </div>
    </div>
  );
}
