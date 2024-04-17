"use client";

import useAutoclaim from "@/hooks/use-autoclaim";
import { useCallback, useState } from "react";

export default function Autoclaim() {
  const [timeValue, setTimeValue] = useState(2.5);
  const [amountValue, setAmountValue] = useState(0);
  const { register } = useAutoclaim();

  const handleSliderChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTimeValue(parseFloat(event.target.value));
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setAmountValue(parseFloat(event.target.value));
  };

  const onRegister = useCallback(async () => {
    await register(timeValue, amountValue);
  }, [timeValue, amountValue, register]);

  return (
    <div className="w-full bg-[#FFFFFFB2] h-[280px] p-6 flex flex-col justify-center items-center rounded-2xl">
      <div className="flex flex-col gap-y-4">
        <label htmlFor="steps-range" className="block mb-2 text-sm font-medium text-gray-900">
          Time treshold
        </label>
        <input id="steps-range" type="range" min="0" max="5" value={timeValue} step="0.5" onChange={handleSliderChange} className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer" />
        <label htmlFor="default-input" className="block mb-2 text-sm font-medium text-gray-900">
          Amount threshold
        </label>
        <input type="number" value={amountValue} onChange={handleInputChange} id="default-input" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" />
        <button className="bg-[#DD7143] px-6 py-2 rounded-full text-white text-lg font-semibold" onClick={onRegister}>
          Register
        </button>
      </div>
    </div>
  );
}
