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
import { gnosis } from "viem/chains";
import { useAccount, useAccountEffect, useBalance, useDisconnect } from "wagmi";
import { FileRejection } from "react-dropzone";

export default function Deposit() {
  const account = useAccount();
  const balance = useBalance({ address: account.address, chainId: gnosis.id });
  const { disconnect } = useDisconnect();
  const router = useRouter();
  const { deposit, txData: depositTxData, depositData, setDepositData } = useDeposit(account);
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
    <div className="w-full h-[475px] lg:h-[375px] bg-[#F0EBDE] flex flex-col text-black rounded-2xl items-center px-4 py-6">
      <p className="font-bold text-xl lg:text-2xl">Gnosis Beacon Chain Deposit</p>
      <div className="w-full flex mt-4">
        <div className="w-full lg:w-2/6 flex flex-col text-base">
          <div className="w-min bg-[#133629] flex items-center rounded-full mt-4 mb-2 lg:mb-7 text-white p-2">
            {truncateAddress(account.address ? account.address : "")} <DocumentDuplicateIcon className="ml-2 h-5 w-5" />
          </div>
          <div className="w-full lg:hidden bg-[#FFFFFFB2] h-[280px] p-6 flex flex-col items-center rounded-2xl hover:cursor-pointer" {...getRootProps()}>
            <input {...getInputProps()} />
            Upload deposit date file
            <div className="flex font-bold items-center">
              deposit_data.json <InformationCircleIcon className="ml-px h-5 w-5" />
            </div>
            <Image src="/drop.svg" alt="Drop" width={80} height={24} className="my-8" />
            <div>Drag file to upload or browse</div>
          </div>
          <div className="flex justify-between items-center lg:flex-col lg:items-start">
            <div>
              Balance:
              <p className="font-bold text-2xl lg:text-4xl lg:mb-7">{Math.round(Number(formatEther(balance.data?.value || BigInt(0))))} GNO</p>
            </div>
            <div>
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
        <div className="hidden w-4/6 bg-[#FFFFFFB2] h-[280px] p-6 lg:flex flex-col items-center rounded-2xl hover:cursor-pointer" {...getRootProps()}>
          <input {...getInputProps()} />
          Upload deposit date file
          <div className="flex font-bold items-center">
            deposit_data.json <InformationCircleIcon className="ml-px h-5 w-5" />
          </div>
          <Image src="/drop.svg" alt="Drop" width={80} height={24} className="my-8" />
          <div>Drag file to upload or browse</div>
        </div>
      </div>
    </div>
  );
}
