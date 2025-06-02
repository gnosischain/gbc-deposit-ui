import { CheckIcon } from '@heroicons/react/16/solid';
import { DepositDataJson } from '@/utils/deposit';
import { CredentialType } from '@/utils/constants';
import { formatUnits } from 'viem';

interface ValidationStepProps {
  depositData: {
    deposits: DepositDataJson[];
    filename: string;
    credentialType: CredentialType | undefined;
    totalDepositAmountBN: bigint;
  };
  onDeposit: () => Promise<void>;
}

export function ValidationStep({
  depositData,
  onDeposit,
}: ValidationStepProps) {

  return (
    <div className='w-full flex flex-col items-center'>
      <div id='filename'>{depositData.filename}</div>
      <div className='flex items-center mt-4'>
        <CheckIcon className='h-5 w-5' /> Accepted
      </div>
      <div className='flex items-center'>
        <CheckIcon className='h-5 w-5' /> Validator deposits:{' '}
        {depositData.deposits.length}
      </div>
      <div className='flex items-center'>
        <CheckIcon className='h-5 w-5' /> Total amount required:{' '}
        {Number(formatUnits(depositData.totalDepositAmountBN, 18))} GNO
      </div>
      <button
        className='bg-accent px-4 py-1 rounded-full text-white mt-4 text-lg font-semibold'
        onClick={() => onDeposit()}
        id='depositButton'
      >
        Deposit
      </button>
    </div>
  );
}
