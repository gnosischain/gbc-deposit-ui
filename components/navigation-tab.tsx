"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

interface NavigationTabProps {
  value: ActionKey;
}

type ActionKey = "deposit" | "dappnode" | "withdrawal" | "validator";

const texts: Record<ActionKey, string> = {
  deposit: "Deposit",
  dappnode: "Dappnode Deposit",
  withdrawal: "Autoclaim Rewards",
  validator: "Validator Status",
};

export default function NavigationTab({ value }: NavigationTabProps) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const handleClick = () => {
    const params = new URLSearchParams(searchParams);
    params.set("state", value);
    replace(`${pathname}?${params.toString()}`);
  };

  return (
    <div onClick={handleClick} className={`${searchParams.get("state") == value ? "border-accent" : ""} w-full flex justify-center items-center text-center p-2 lg:p-3.5 font-bold border-b-2 hover:cursor-pointer`} id={value}>
      {texts[value]}
    </div>
  );
}
