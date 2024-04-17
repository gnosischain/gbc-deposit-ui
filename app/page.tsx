import Image from "next/image";
import Link from "next/link";

export default function Page() {
  return (
    <main className="flex h-screen flex-col items-center justify-center">
      <div className="w-full lg:w-[625px] h-full lg:h-auto bg-green backdrop-blur-sm p-8 lg:rounded-2xl flex gap-y-4 flex-col justify-start items-center">
        <div className="w-full lg:w-[550px] h-60 border-b flex gap-y-2 flex-col justify-end items-center pb-2">
          <Image src="/logo.svg" alt="Gnosis Logo" width={100} height={24} />
          <Image src="/gnosis.svg" alt="Gnosis Text" width={250} height={24} />
        </div>
        <p className="text-xl">BEACON CHAIN DEPOSIT</p>
        <p className="text-xl my-8">Connect your wallet to get started:</p>
        <Link href="/connect" className="bg-[#DD7143] px-8 py-4 rounded-full text-xl font-semibold">
          Connect Wallet
        </Link>
        <p className="mt-20 underline">Learn more about Gnosis Beacon Chain</p>
      </div>
    </main>
  );
}
