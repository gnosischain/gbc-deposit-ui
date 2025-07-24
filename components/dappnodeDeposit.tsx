'use client';

import useDappnodeDeposit from '@/hooks/useDappnodeDeposit';
import { CheckIcon, InformationCircleIcon } from '@heroicons/react/20/solid';
import Image from 'next/image';
import Link from 'next/link';
import {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useState,
} from 'react';
import { FileRejection, useDropzone } from 'react-dropzone';
import { Address } from 'viem';
import Loader from './loader';
import { ContractNetwork } from '@/utils/contracts';
import { DepositDataJson } from '@/types/deposit';
import { toast } from 'react-toastify';

interface DappNodeDepositProps {
  contractConfig: ContractNetwork;
  address: `0x${string}`;
  chainId: number;
}

export type DappnodeUser = {
  safe: string;
  status: Steps;
  expectedDepositCount: number;
  totalStakeAmount: number;
};

enum Steps {
  NOT_INCLUDED = 'notIncluded',
  PENDING = 'pending',
  SUBMITTED = 'submitted',
  VALIDATION = 'validation',
  EXECUTED = 'executed',
}

type state = {
  step: Steps;
  loading: boolean;
  tx: `0x${string}`;
};

export default function DappnodeDeposit({
  contractConfig,
  address,
  chainId,
}: DappNodeDepositProps) {
  const [state, setState] = useState<state>({
    step: Steps.NOT_INCLUDED,
    loading: false,
    tx: '0x0',
  });

  const {
    setDappnodeDepositData,
    depositData,
    depositSuccess,
    depositHash,
    user,
    dappnodeDeposit,
    claimStatusPending,
    claimStatusError,
  } = useDappnodeDeposit(contractConfig, address, chainId);

  const [tx, setTx] = useState<Address>('0x0');

  useEffect(() => {
    if (user) {
      if (user[0] === '0x0000000000000000000000000000000000000000') {
        setState((prev) => ({ ...prev, step: Steps.NOT_INCLUDED }));
      } else {
        if (user[1] === 0) {
          setState((prev) => ({ ...prev, step: Steps.PENDING }));
        } else if (user[1] === 1) {
          setState((prev) => ({ ...prev, step: Steps.SUBMITTED }));
        } else if (user[1] === 2) {
          setState((prev) => ({ ...prev, step: Steps.EXECUTED }));
        }
      }
    }
  }, [user]);

  useEffect(() => {
    if (depositSuccess) {
      setState((prev) => ({ ...prev, loading: false, step: Steps.SUBMITTED }));
    }
  }, [depositSuccess]);

  useEffect(() => {
    if (depositHash) {
      setTx(depositHash);
    }
  }, [depositHash]);

  return (
    <div className='w-full bg-[#FFFFFFB2] p-3 flex flex-col justify-center items-center rounded-2xl'>
      {state.loading ? (
        <>
          <Loader />
          <p className='mt-2'>Loading...</p>
        </>
      ) : state.step === 'notIncluded' ? (
        <AddressNotIncluded />
      ) : state.step === 'pending' ? (
        <PendingStatus
          safeAddress={user ? user[0] : ''}
          setState={setState}
          setDappnodeDepositData={setDappnodeDepositData}
        />
      ) : state.step === 'validation' ? (
        <Validation
          depositData={depositData}
          dappnodeDeposit={dappnodeDeposit}
          claimStatusPending={claimStatusPending}
          claimStatusError={claimStatusError}
        />
      ) : state.step === 'submitted' ? (
        <SubmittedStatus tx={tx} />
      ) : state.step === 'executed' ? (
        <ExecutedStatus safeAddress={user ? user[0] : ''} />
      ) : (
        ''
      )}
    </div>
  );
}

function AddressNotIncluded() {
  return (
    <div className='flex flex-col w-full h-full justify-evenly   text-center'>
      {' '}
      <p className='text-red-400 font-bold text-lg'>
        The wallet address provided is not included in Dappnode&apos;s GNO
        Incentive Program!
      </p>{' '}
      <p>Please, ensure you have connected with the correct address</p>
    </div>
  );
}

function PendingStatus({
  setState,
  safeAddress,
  setDappnodeDepositData,
}: {
  safeAddress: string;
  setState: Dispatch<SetStateAction<state>>;
  setDappnodeDepositData: (fileData: string, filename: string) => Promise<void>;
}) {
  let formattedSafe = '0x' + safeAddress.slice(-40);

  const onDrop = useCallback(
    async (acceptedFiles: File[], rejectedFiles: FileRejection[]) => {
      if (rejectedFiles.length > 0) {
      } else if (acceptedFiles.length > 0) {
        const reader = new FileReader();
        reader.onload = async (event) => {
          const result = event.target?.result as string;
          if (result) {
            try {
              setState((prev) => ({ ...prev, loading: true }));
              await setDappnodeDepositData(result, acceptedFiles[0].name);
              setState((prev) => ({ ...prev, loading: false, step: Steps.VALIDATION }));
            } catch (error: any) {
              toast.error(error.message || 'An error occurred.');
              setState((prev) => ({
                ...prev,
                step: Steps.NOT_INCLUDED,
                loading: false,
              }));
            }
          }
        };
        reader.readAsText(acceptedFiles[0]);
      }
    },
    [setDappnodeDepositData, setState]
  );

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: { 'application/json': [] },
    maxFiles: 1,
  });
  return (
    <div className='w-full h-full flex flex-col items-center justify-evenly'>
      <span className='text-sm'>
        {' '}
        Your Safe address is{' '}
        <span className='text-green text-xs'>{formattedSafe}</span>
      </span>
      <div
        className='w-full flex flex-col items-center hover:cursor-pointer'
        {...getRootProps()}
      >
        <input {...getInputProps()} />
        Upload deposit date file
        <div className='flex font-bold items-center'>
          deposit_data.json <InformationCircleIcon className='ml-px h-5 w-5' />
        </div>
        <Image
          src='/drop.svg'
          alt='Drop'
          width={80}
          height={24}
          className='my-8 rounded-full shadow-lg'
        />
        <div>Drag file to upload or browse</div>
      </div>
    </div>
  );
}

function Validation({
  depositData,
  dappnodeDeposit,
  claimStatusPending,
  claimStatusError,
}: {
  depositData: {
    deposits: DepositDataJson[];
    filename: string;
    isBatch: boolean;
  };
  dappnodeDeposit: () => Promise<void>;
  claimStatusPending: boolean;
  claimStatusError: boolean;
}) {
  const onDeposit = useCallback(async () => {
    await dappnodeDeposit();
  }, [dappnodeDeposit]);

  return claimStatusPending ? (
    <div className='flex flex-col items-center gap-4'>
      <Loader />
      <p>Check your wallet provider to continue!</p>
    </div>
  ) : (
    <div className='w-full flex flex-col items-center'>
      {depositData.filename}
      <div className='flex items-center mt-4'>
        <CheckIcon className='h-5 w-5' /> File accepted
      </div>
      <div className='flex items-center'>
        <CheckIcon className='h-5 w-5' /> Safe address as Withdrawal
      </div>
      <div className='flex items-center'>
        <CheckIcon className='h-5 w-5' /> Validator deposits:{' '}
        {depositData.deposits.length}
      </div>
      <div className='flex items-center'>
        <CheckIcon className='h-5 w-5' /> Total amount requested:{' '}
        {depositData.deposits.length} GNO
      </div>
      {depositData.isBatch ? (
        ''
      ) : (
        <p className='text-orange-400 text-xs text-center'>
          Your deposit file contains BLS credentials (starting with 0x00). You
          can generate the keys again, specifying the safe that we provided to
          you as withdrawal credentials.
        </p>
      )}
      <button
        className='bg-accent px-4 py-1 rounded-full text-white mt-4 text-lg font-semibold'
        onClick={onDeposit}
      >
        Claim
      </button>
      {claimStatusError && (
        <p className='text-red-500 text-center text-sm mt-5'>
          Error when submitting the transaction. <br />
          Check the console for more details!
        </p>
      )}
    </div>
  );
}

function SubmittedStatus({ tx }: { tx: `0x${string}` }) {
  return (
    <div className='flex flex-col justify-evenly text-center h-full'>
      <div className='text-lg font-bold text-green'>
        Your claim has been submitted!
      </div>
      <div>
        {' '}
        Check the transaction
        <Link
          href={'https://gnosis.blockscout.com/tx/' + tx}
          target='_blank'
          className='text-accent underline ml-1'
        >
          here.
        </Link>
      </div>
      <div>
        Dappnode&apos;s team will check and execute your claim to your safe
        address. This is executed at least once a week.
      </div>
      <div>Make sure your keystores are already in your Dappnode.</div>
      <div>Once it&apos;s done you will be able to check it in this UI.</div>
    </div>
  );
}

function ExecutedStatus({ safeAddress }: { safeAddress: string }) {
  let formattedSafe = '0x' + safeAddress.slice(-40);

  return (
    <div className='w-full flex flex-col items-center'>
      <div className='flex items-center flex-col gap-5 text-center'>
        <div className='text-lg font-bold text-green'>
          Your deposit has been executed!
        </div>
        <span className='t'>
          {' '}
          Your Safe address is{' '}
          <span className='text-green text-xs'>{formattedSafe}</span>
        </span>
        <div>
          Ensure you keystores are already in your Dappnode to start validating.
        </div>
      </div>
    </div>
  );
}
