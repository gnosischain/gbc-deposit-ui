"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { XMarkIcon } from "@heroicons/react/20/solid";
import Image from "next/image";
import { useAccount, useConnect } from "wagmi";

export default function Page() {
  const account = useAccount();
  const { connectors, connect, status, error } = useConnect();
  const router = useRouter();

  console.log(account.status);

  useEffect(() => {
    if (account.status == "connected") {
      router.push("/connected");
    }
  }, [account.status, router]);

  return (
    <main className="flex h-screen w-screen bg-[#000000b3] backdrop-blur-xl flex-col items-center justify-center">
      <div className="w-[590px] h-[550px] bg-[#F0EBDE] p-6 rounded-3xl flex gap-y-4 flex-col justify-start items-center">
        <div className="w-full flex justify-end">
          <XMarkIcon className="h-8 w-8 text-blue-950" />{" "}
        </div>
        <p className="text-3xl text-black font-bold mt-8 w-1/2 text-center">Choose your preferred wallet</p>
        <div className="w-full flex flex-col divide-slate-700 divide-y mt-8">
          {connectors.slice(1).map((connector) => (
            <div className="flex w-full justify-between items-center text-black hover:bg-[#E8E1CF] py-4 p-2 first:rounded-t-lg last:rounded-b-lg" key={connector.uid} onClick={() => connect({ connector })}>
              {connector.name} <Image src={"/" + connector.id + ".png"} alt={connector.id} width={55} height={24} priority />
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
