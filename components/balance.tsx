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
    <div className='flex items-center justify-center rounded-lg divide-x divide-gray-300'>
      <div className='flex flex-col'>
        <p>GNO Balance</p>
        <p className='text-2xl font-bold'>
          {Number(formatEther(balance)).toFixed(2)}
        </p>
      </div>
      <div className='flex flex-col'>
        <p>Ready to claim</p>
        <div className='flex'>
          <p className='text-2xl font-bold'>
            {Number(formatEther(claimBalance)).toFixed(2)}
          </p>
          <Button onClick={claim}>Claim</Button>
        </div>
      </div>
    </div>
  );
}
