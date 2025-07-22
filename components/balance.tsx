import useBalance from '@/hooks/useBalance';
import { ContractNetwork } from '@/utils/contracts';
import { Button } from '@headlessui/react';
import { formatEther } from 'viem';

interface BalanceProps {
  contractConfig: ContractNetwork;
  address: `0x${string}`;
}

export function Balance({ contractConfig, address }: BalanceProps) {
  const { balance, claimBalance, claim } = useBalance(contractConfig, address);

  return (
    <div className='flex items-center justify-center rounded-lg gap-x-2'>
      <div className='flex flex-col'>
        <p className='font-light text-sm'>GNO Balance</p>
        <p className='text-2xl font-bold'>
          {Number(formatEther(balance)).toFixed(2)}
        </p>
      </div>
      <div className='border border-gray-300 h-full'></div>
      <div className='flex flex-col'>
        <p className='font-light text-sm'>Ready to claim</p>
        <div className='flex gap-x-2 items-center'>
          <p className='text-2xl font-bold'>
            {Number(formatEther(claimBalance)).toFixed(2)}
          </p>
          <Button className="rounded-lg bg-blue-900/80 py-1 px-3 text-sm" onClick={claim}>Claim</Button>
        </div>
      </div>
    </div>
  );
}
