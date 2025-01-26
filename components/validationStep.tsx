import { CheckIcon } from '@heroicons/react/16/solid';
import { DepositDataJson } from '@/utils/deposit';
import { CredentialType } from '@/utils/constants';
import { depositAmountBN } from '@/hooks/use-deposit';

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
        {depositData.totalDepositAmountBN / depositAmountBN} GNO
      </div>
      {depositData.credentialType === '02' ? (
        ''
      ) : (
        <p className='text-orange-400 text-xs text-center'>
          Your deposit file contains BLS credentials (starting with 0x00),
          you&apos;ll be asked to sign a transaction for each of them.
          Alternatively you can generate the keys again, make sure to specify an
          eth1 address for the withdrawal credentials.
        </p>
      )}
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
