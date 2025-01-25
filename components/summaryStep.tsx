import { ArrowUturnLeftIcon, CheckIcon } from '@heroicons/react/16/solid';
import Link from 'next/link';

interface SummaryStepProps {
  explorerUrl: string;
  tx: string;
  goToStep: () => void;
}

export function SummaryStep({ explorerUrl, tx, goToStep }: SummaryStepProps) {
  return (
    <div className='w-full flex flex-col items-center'>
      <div className='flex items-center' id='confirmation'>
        <CheckIcon className='h-5 w-5' /> Your transaction is completed ! View
        it
        <Link
          href={explorerUrl + 'tx/' + tx}
          target='_blank'
          className='text-accent underline ml-1'
        >
          here
        </Link>
        .
      </div>
      <button
        className='text-accent flex items-center px-4 py-1 rounded-full mt-4 text-base font-semibold'
        onClick={goToStep}
      >
        Back <ArrowUturnLeftIcon className='h-4 w-4 ml-2' />
      </button>
    </div>
  );
}
