'use client';

import useDeposit from '@/hooks/useDeposit';
import { useCallback, useEffect, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { FileRejection } from 'react-dropzone';
import Loader from './loader';
import { ContractNetwork } from '@/utils/contracts';
import { toast } from 'react-toastify';
import { DepositStep } from './depositStep';
import { ValidationStep } from './validationStep';
import { SummaryStep } from './summaryStep';
import { BaseError } from 'wagmi';
import { WarningStep } from './warningStep';
import { Switch } from '@headlessui/react';

interface DepositProps {
  contractConfig: ContractNetwork;
  address: `0x${string}`;
  chainId: number;
}

enum Steps {
  DEPOSIT = 'deposit',
  VALIDATION = 'validation',
  SUMMARY = 'summary',
  WARNING = 'warning',
}

export type state = {
  step: Steps;
  loading: boolean;
  tx: `0x${string}`;
};

export default function Deposit({
  contractConfig,
  address,
  chainId,
}: DepositProps) {
  const {
    setDepositData,
    depositData,
    deposit,
    depositSuccess,
    contractError,
    txError,
    depositHash,
  } = useDeposit(contractConfig, address, chainId);
  const [state, setState] = useState<state>({
    step: Steps.DEPOSIT,
    loading: false,
    tx: '0x0',
  });

  useEffect(() => {
    if (contractError) {
      toast.error(
        (contractError as BaseError)?.shortMessage ||
          contractError.message ||
          'Contract error occurred.'
      );
      setState((prev) => ({ ...prev, step: Steps.DEPOSIT, loading: false }));
    }

    if (txError) {
      toast.error(
        (txError as BaseError)?.shortMessage ||
          txError.message ||
          'Transaction error occurred.'
      );
      setState((prev) => ({ ...prev, step: Steps.DEPOSIT, loading: false }));
    }
  }, [contractError, txError]);
  const onDrop = useCallback(
    async (acceptedFiles: File[], rejectedFiles: FileRejection[]) => {
      if (rejectedFiles.length > 0) {
        toast.error('Please upload a valid JSON file.');
      } else if (acceptedFiles.length > 0) {
        const reader = new FileReader();
        reader.onload = async (event) => {
          const result = event.target?.result as string;
          if (result) {
            try {
              setState((prev) => ({ ...prev, loading: true }));
              //TODO: better implementation for handling credential type
              const credentialType = await setDepositData(
                result,
                acceptedFiles[0].name
              );
              setState((prev) => ({
                ...prev,
                step:
                  credentialType === '02' ? Steps.VALIDATION : Steps.WARNING,
                loading: false,
              }));
            } catch (error: any) {
              toast.error(error.message || 'An error occurred.');
              setState((prev) => ({
                ...prev,
                step: Steps.DEPOSIT,
                loading: false,
              }));
            }
          }
        };
        reader.readAsText(acceptedFiles[0]);
      }
    },
    [setDepositData]
  );

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: { 'application/json': [] },
    maxFiles: 1,
  });

  const onDeposit = useCallback(async () => {
    setState((prev) => ({ ...prev, loading: true }));
    await deposit();
  }, [deposit]);

  useEffect(() => {
    if (depositSuccess) {
      setState((prev) => ({ ...prev, step: Steps.SUMMARY, loading: false }));
    }
  }, [depositSuccess]);

  useEffect(() => {
    if (depositHash) {
      setState((prev) => ({ ...prev, tx: depositHash }));
    }
  }, [depositHash]);

  const renderStep = () => {
    switch (state.step) {
      case Steps.DEPOSIT:
        return (
          <DepositStep
            getRootProps={getRootProps}
            getInputProps={getInputProps}
          />
        );
      case Steps.WARNING:
        return (
          <WarningStep
            goToStep={() =>
              setState((prev) => ({ ...prev, step: Steps.VALIDATION }))
            }
            credentialType={depositData.credentialType!}
          />
        );
      case Steps.VALIDATION:
        return (
          <ValidationStep depositData={depositData} onDeposit={onDeposit} />
        );
      case Steps.SUMMARY:
        return (
          <SummaryStep
            explorerUrl={contractConfig?.blockExplorerUrl || ''}
            tx={state.tx}
            goToStep={() =>
              setState((prev) => ({ ...prev, step: Steps.DEPOSIT }))
            }
          />
        );
    }
  };

  return (
    <div className='w-full h-full bg-[#FFFFFFB2] flex flex-col justify-center items-center rounded-2xl'>
      {state.loading ? (
        <>
          <Loader />
          <p className='mt-2'>Loading...</p>
        </>
      ) : (
        renderStep()
      )}
    </div>
  );
}
