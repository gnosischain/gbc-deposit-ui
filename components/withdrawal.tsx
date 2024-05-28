import useAutoclaim from "@/hooks/use-autoclaim";
import useClaimBalance from "@/hooks/use-claim-balance";
import { ArrowUturnLeftIcon, CheckIcon } from "@heroicons/react/20/solid";
import { useCallback, useEffect, useState } from "react";
import Loader from "./loader";
import { Address, formatEther } from "viem";
import Link from "next/link";

export default function Withdrawal() {
  const { claim, claimBalance, claimSuccess, claimHash } = useClaimBalance();
  const { register, updateConfig, unregister, isRegister, autoclaimSuccess, autoclaimHash, chainId } = useAutoclaim();
  const [timeValue, setTimeValue] = useState(1);
  const [amountValue, setAmountValue] = useState("1");
  const [step, setStep] = useState("claim");
  const [tx, setTx] = useState<Address>("0x0");
  const [loading, setLoading] = useState(false);

  const handleRadioChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTimeValue(parseFloat(event.target.value));
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const inputVal = event.target.value;
    setAmountValue(inputVal);
  };

  const onAutoclaim = useCallback(async () => {
    const parsedValue = parseFloat(amountValue.replace(/,/, "."));
    if (!isNaN(parsedValue) && parsedValue > 0) {
      setLoading(true);
      if (isRegister) {
        await updateConfig(timeValue, parsedValue);
      } else {
        await register(timeValue, parsedValue);
      }
    }
  }, [timeValue, amountValue, isRegister, register, updateConfig]);

  const onClaim = useCallback(async () => {
    setLoading(true);
    await claim();
  }, [claim]);

  const onUnregister = useCallback(async () => {
    setLoading(true);
    await unregister();
  }, [unregister]);

  useEffect(() => {
    if (claimSuccess || autoclaimSuccess) {
      setLoading(false);
      setStep("summary");
    }
  }, [claimSuccess, autoclaimSuccess]);

  useEffect(() => {
    if (claimHash) {
      setTx(claimHash);
    } else if (autoclaimHash) {
      setTx(autoclaimHash);
    }
  }, [claimHash, autoclaimHash]);

  return (
    <div className="w-full bg-[#FFFFFFB2] h-[280px] p-4 flex flex-col justify-center items-center rounded-2xl">
      {loading ? (
        <div>
          <Loader />
          <p className="mt-2">Loading...</p>
        </div>
      ) : step === "claim" ? (
        <>
          <div className="w-full text-sm flex justify-center">Set up automated claim with your preferred frequency and threshold.</div>
          <div className="flex h-full flex-col justify-center gap-y-4">
            <div className="flex flex-col">
              <label htmlFor="default-input" className="block mb-2 text-xs font-bold text-gray-700">
                Time threshold
              </label>
              <div className="flex gap-x-4 ">
                <div className="flex items-center">
                  <input onChange={handleRadioChange} id="day" defaultChecked type="radio" value={1} name="inline-radio-group" className="w-4 h-4 accent-[#DD7143]" />
                  <label htmlFor="day" className="block text-sm ml-1 font-medium text-gray-900">
                    day
                  </label>
                </div>
                <div className="flex items-center">
                  <input onChange={handleRadioChange} id="week" type="radio" value={7} name="inline-radio-group" className="w-4 h-4 accent-[#DD7143]" />
                  <label htmlFor="week" className="block text-sm ml-1 font-medium text-gray-900">
                    week
                  </label>
                </div>
                <div className="flex items-center">
                  <input onChange={handleRadioChange} id="month" type="radio" value={30} name="inline-radio-group" className="w-4 h-4 accent-[#DD7143]" />
                  <label htmlFor="month" className="block text-sm ml-1 font-medium text-gray-900">
                    month
                  </label>
                </div>
              </div>
            </div>
            <div className="flex flex-col">
              <label htmlFor="default-input" className="block mb-2 text-xs font-bold text-gray-700">
                Amount threshold
              </label>
              <input type="text" value={amountValue.toString()} onChange={handleInputChange} id="default-input" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-1" />
            </div>
            <button className="bg-[#DD7143] py-1 rounded-full text-white text-lg font-semibold" onClick={onAutoclaim}>
              {isRegister ? "Update" : "Register"}
            </button>
          </div>
          <div className="w-full flex text-sm items-center justify-between">
            <div className="w-full flex gap-x-2">
              Claimable balance:
              <div className="flex font-bold items-center">{Number(formatEther(claimBalance || BigInt(0))).toFixed(3)} GNOS</div>
              <button className="text-[#DD7143] underline hover:text-[#E07F55]" onClick={onClaim}>
                Manual claim
              </button>
            </div>
            {isRegister && (
              <button className="text-black underline" onClick={onUnregister}>
                Unsubscribe
              </button>
            )}
          </div>
        </>
      ) : step === "summary" ? (
        <div className="w-full flex flex-col items-center">
          <div className="flex items-center">
            <CheckIcon className="h-5 w-5" /> Your transaction is completed ! View it
            <Link href={chainId === 100 ? "https://gnosis.blockscout.com/tx/" + tx : "https://gnosis-chiado.blockscout.com/tx/" + tx} target="_blank" className="text-[#DD7143] underline ml-1">
              here
            </Link>
            .
          </div>
          <button className="text-[#DD7143] flex items-center px-4 py-1 rounded-full mt-4 text-base font-semibold" onClick={() => setStep("claim")}>
            Back <ArrowUturnLeftIcon className="h-4 w-4 ml-2" />
          </button>
        </div>
      ) : (
        ""
      )}
    </div>
  );
}
