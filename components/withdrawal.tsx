"use client";

import useClaimBalance from "@/hooks/use-claim-balance";
import { useRouter } from "next/navigation";
import { useAccount, useAccountEffect } from "wagmi";

export default function Withdrawal() {
  const router = useRouter();
  const { claim, claimBalance } = useClaimBalance();

  useAccountEffect({
    onDisconnect() {
      router.push("/");
    },
  });

  return (
    <div className="w-full bg-[#FFFFFFB2] h-[280px] p-6 flex flex-col justify-center items-center rounded-2xl">
      Claimable balance:
      <div className="flex font-bold items-center my-8">{claimBalance?.toString()} GNOS</div>
      <button className="bg-[#DD7143] px-6 py-2 rounded-full text-white text-lg font-semibold" onClick={claim}>
        Claim
      </button>
    </div>
  );
}
