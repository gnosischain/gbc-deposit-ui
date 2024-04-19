import useAutoclaim from "@/hooks/use-autoclaim";
import useClaimBalance from "@/hooks/use-claim-balance";
import { useCallback, useState } from "react";

export default function Withdrawal() {
  const { claim, claimBalance } = useClaimBalance();
  const [timeValue, setTimeValue] = useState(1);
  const [amountValue, setAmountValue] = useState(0);
  const { register } = useAutoclaim();

  const handleRadioChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTimeValue(parseFloat(event.target.value));
    console.log(parseFloat(event.target.value));
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setAmountValue(parseFloat(event.target.value));
  };

  const onRegister = useCallback(async () => {
    await register(timeValue, amountValue);
  }, [timeValue, amountValue, register]);

  return (
    <div className="w-full bg-[#FFFFFFB2] h-[280px] p-4 flex flex-col justify-between items-center rounded-2xl">
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
          <input type="number" value={amountValue} onChange={handleInputChange} id="default-input" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-1" />
        </div>
        <button className="bg-[#DD7143] py-1 rounded-full text-white text-lg font-semibold" onClick={onRegister}>
          Register
        </button>
      </div>
      <div className="w-full flex text-sm items-center gap-x-2">
        Claimable balance:
        <div className="flex font-bold items-center">{claimBalance?.toString()} GNOS</div>
        <button className="text-[#DD7143] hover:text-[#E07F55]" onClick={claim}>
          Manual claim
        </button>
      </div>
    </div>
  );
}
