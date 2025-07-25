import { DepositDataJson } from '@/types/deposit';
import { CheckIcon } from '@heroicons/react/16/solid';
import { formatGwei, parseGwei } from 'viem';

interface ValidationStepProps {
  filename: string;
  depositData: {
    deposits: DepositDataJson[];
    totalDepositAmount: bigint;
  };
  onApprove: (amount: bigint) => Promise<void>;
  onDeposit: () => Promise<void>;
  isApproved: boolean;
}

export function ValidationStep({
  filename,
  depositData,
  onApprove,
  onDeposit,
  isApproved,
}: ValidationStepProps) {

  const handleClick = async () => {
    if (isApproved) {
      await onDeposit();
    } else {
      const approvalAmount = parseGwei(depositData.totalDepositAmount.toString()) / 32n;
      await onApprove(approvalAmount);
    }
  };

  return (
    <div className='w-full flex flex-col items-center'>
      <p className='text-sm text-gray-500'>Remember: you need to sign 2 transactions to approve and deposit</p>
      <div id='filename'>{filename}</div>
      <div className='flex items-center mt-4'>
        <CheckIcon className='h-5 w-5' /> Accepted
      </div>
      <div className='flex items-center'>
        <CheckIcon className='h-5 w-5' /> Validator deposits:{' '}
        {depositData.deposits.length}
      </div>
      <div className='flex items-center'>
        <CheckIcon className='h-5 w-5' /> Total amount required:{' '}
        {formatGwei(depositData.totalDepositAmount / 32n)} GNO
      </div>
      <button
        className='bg-accent px-4 py-1 rounded-full text-white mt-4 text-lg font-semibold'
        onClick={handleClick}
        id='depositButton'
      >
        {isApproved ? '2. Deposit ' : '1. Approve ' + formatGwei(depositData.totalDepositAmount / 32n) + ' GNO'}
      </button>
    </div>
  );
}
