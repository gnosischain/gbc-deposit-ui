import { CredentialType } from '@/utils/constants';
import Link from 'next/link';

interface WarningStepProps {
  credentialType: CredentialType;
  goToStep: () => void;
}

export function WarningStep({ goToStep, credentialType }: WarningStepProps) {
  return (
    <div className='w-full flex flex-col items-center justify-center'>
      <div className='text-center'>
        You are about to make a deposit with a deprecated credential type. You
        can regenerate new keys for Gnosis Chain{' '}
        <Link href='https://github.com/eth-educators/ethstaker-deposit-cli' className='text-blue-500 underline'>
          here
        </Link>{' '}
        and make a deposit.
      </div>
      <button
        className='bg-accent px-4 py-1 rounded-full text-white mt-4 text-md font-semibold'
        onClick={() => goToStep()}
        id='depositButton'
      >
        I understand
      </button>
      {credentialType === '00' ? (
        <p className='text-orange-400 text-xs text-center'>
          Your deposit file contains BLS credentials (starting with 0x00),
          you&apos;ll be asked to sign a transaction for each of them.
          Alternatively you can generate the keys again, make sure to specify an
          eth1 address for the withdrawal credentials.
        </p>
      ) : (
        ''
      )}
    </div>
  );
}
