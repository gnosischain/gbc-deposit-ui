import { Select } from '@headlessui/react';
import { useSwitchChain } from 'wagmi';
import { useEffect, useState } from 'react';

interface NetworkSwitcherProps {
  currentChainId: number | undefined;
}

export function NetworkSwitcher({ currentChainId }: NetworkSwitcherProps) {
  const { chains, switchChain } = useSwitchChain();
  const [selectedChain, setSelectedChain] = useState(currentChainId);

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const chainId = Number(event.target.value) as typeof currentChainId;
    const selectedChain = chains.find(
      (chain) => chain.id === Number(event.target.value)
    );
    if (selectedChain) {
      setSelectedChain(chainId);
      switchChain({ chainId: selectedChain.id });
    }
  };

  useEffect(() => {
    setSelectedChain(currentChainId);
  }, [currentChainId]);

  return (
    <div className='w-36'>
      {selectedChain === undefined ? (
        <div className='mt-1 text-black'>
          Loading Network
        </div>
      ) : (
        <Select
          value={selectedChain}
          onChange={handleChange}
          id='network'
          className='flex items-center justify-between w-full rounded-lg bg-[#e6e1d3] p-2 font-bold'
        >
          {chains.map((chain) => (
            <option
              key={chain.id}
              value={chain.id}
              className='rounded-xl mt-1 text-black bg-[#e6e1d3] p-1 shadow-md focus:outline-none transition duration-100 ease-in'
            >
              {chain.name}
            </option>
          ))}
        </Select>
      )}
    </div>
  );
}
