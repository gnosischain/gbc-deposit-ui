"use client";

import useDeposit from "@/hooks/use-deposit";
import { truncateAddress } from "@/utils/truncateAddress";
import { ArrowRightStartOnRectangleIcon, DocumentDuplicateIcon } from "@heroicons/react/24/outline";
import { useRouter, useSearchParams } from "next/navigation";
import { formatEther } from "viem";
import { useAccount, useAccountEffect, useDisconnect } from "wagmi";
import Deposit from "./deposit";
import Withdrawal from "./withdrawal";

export default function Dashboard() {
  const searchParams = useSearchParams();
  const account = useAccount();
  const { disconnect } = useDisconnect();
  const router = useRouter();
  const { balance } = useDeposit();

  useAccountEffect({
    onDisconnect() {
      router.push("/");
    },
  });

  return (
    <div className="w-full h-[515px] lg:h-[375px] bg-[#F0EBDE] flex flex-col text-black rounded-2xl items-center px-4 py-6">
      <p className="font-bold text-xl lg:text-2xl">{searchParams.get("state") == "validator" ? "Check Validators Status" : "Gnosis Beacon Chain Deposit"}</p>
      <div className="w-full flex mt-4">
        <div className="w-full lg:w-2/6 flex flex-col text-base">
          <div className="w-min bg-[#133629] flex items-center rounded-full mt-4 mb-2 lg:mb-7 text-white p-2 hover:cursor-pointer">
            {truncateAddress(account.address ? account.address : "")} <DocumentDuplicateIcon className="ml-2 h-5 w-5" />
          </div>
          <div className="flex lg:hidden">{searchParams.get("state") == "deposit" ? <Deposit /> : searchParams.get("state") == "withdrawal" ? <Withdrawal /> : ""}</div>
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
        <div className="w-full hidden lg:flex">{searchParams.get("state") == "deposit" ? <Deposit /> : searchParams.get("state") == "withdrawal" ? <Withdrawal /> : ""}</div>
      </div>
    </div>
  );
}
