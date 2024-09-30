import Image from "next/image";
import Link from "next/link";

export default function Page() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center">
      <div className="w-full lg:w-[625px] h-full lg:h-auto bg-green backdrop-blur-sm p-8 lg:rounded-2xl flex gap-y-4 flex-col justify-start items-center">
        <div className="w-full lg:w-[550px] h-60 border-b flex gap-y-2 flex-col justify-end items-center pb-2">
          <Image src="/logo.svg" alt="Gnosis Logo" width={100} height={24} />
          <Image src="/gnosis.svg" alt="Gnosis Text" width={250} height={24} />
        </div>
        <p className="text-xl">BEACON CHAIN DEPOSIT</p>
        <p className="text-xl my-8">Connect your wallet to get started:</p>
        <Link href="/connect" className="bg-accent px-8 py-4 rounded-full text-xl font-semibold outline outline-2 outline-transparent hover:outline-white/80 transition-all duration-300 ease-in-out">
          Connect Wallet
        </Link>
        <Link target="_blank" className="w-full flex justify-center mt-20 text-sm lg:text-base items-center underline hover:text-slate-200" href={"https://docs.gnosischain.com/node/"}>
          Learn more about the Gnosis Beacon Chain
        </Link>
      </div>
    </main>
  );
}
