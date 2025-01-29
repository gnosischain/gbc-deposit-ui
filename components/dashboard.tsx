'use client';

import { Suspense, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useDisconnect } from 'wagmi';
import { truncateAddress } from '@/utils/truncateAddress';
import {
  ArrowRightStartOnRectangleIcon,
  DocumentDuplicateIcon,
  CheckIcon,
} from '@heroicons/react/24/outline';
import useContractConfig from '@/hooks/useContractConfig';
import Deposit from './deposit';
import DappnodeDeposit from './dappnodeDeposit';
import Withdrawal from './withdrawal';
import Validator from './validator';
import { NetworkSwitcher } from './networkSwitcher';
import Consolidate from './consolidate';
import { Balance } from './balance';
import { Switch } from '@headlessui/react';

export default function Dashboard() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { disconnect } = useDisconnect();
  const { account, chainId, contractConfig } = useContractConfig();
  const [isCopied, setIsCopied] = useState(false);
  const [connectionAttempted, setConnectionAttempted] = useState(false);
  const [dappNode, setDappNode] = useState(false);

  useEffect(() => {
    if (account.isConnecting) {
      setConnectionAttempted(true);
    } else if (connectionAttempted && !account.isConnected) {
      router.push('/');
    }
  }, [account.isConnecting, connectionAttempted, account.isConnected, router]);

  const handleCopyAddress = async () => {
    if (account.address) {
      try {
        await navigator.clipboard.writeText(account.address);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 1000);
      } catch (err) {
        console.error('Failed to copy!', err);
      }
    }
  };

  useEffect(() => {
    if (chainId !== 100) {
      setDappNode(false);
    }
  }, [chainId]);

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Balance
        contractConfig={contractConfig}
        address={account.address || '0x0'}
      />
      <div className='w-full h-[590px] lg:h-[375px] bg-[#F0EBDE] flex flex-col text-black rounded-2xl items-center justify-between p-4'>
        <p className='font-bold text-xl lg:text-2xl'>
          {searchParams.get('state') === 'validator'
            ? 'Check Validators Status'
            : 'Gnosis Beacon Chain Deposit'}
        </p>
        <div className='w-full h-full flex flex-col-reverse lg:flex-row mt-4'>
          <div className='w-full lg:w-2/6 flex flex-col text-base'>
            {chainId === 100 && searchParams.get('state') === 'deposit' ? (
              <div className='flex'>
                DappNode deposit
                <Switch
                  checked={dappNode}
                  onChange={setDappNode}
                  className='group inline-flex h-6 w-11 items-center rounded-full bg-gray-200 transition data-[checked]:bg-blue-600'
                >
                  <span className='size-4 translate-x-1 rounded-full bg-white transition group-data-[checked]:translate-x-6' />
                </Switch>
              </div>
            ) : null}
            <div
              id='accounts'
              className='w-min bg-[#133629] hidden lg:flex items-center rounded-full mt-4 mb-2 lg:mb-7 text-white p-2 hover:cursor-pointer hover:bg-[#2a4a3e]'
              onClick={handleCopyAddress}
            >
              {truncateAddress(account.address || '')}
              {isCopied ? (
                <CheckIcon className='ml-2 h-5 w-5' />
              ) : (
                <DocumentDuplicateIcon className='ml-2 h-5 w-5' />
              )}
            </div>
            <div className='flex flex-col gap-y-4 justify-between items-start mt-4 lg:mt-0'>
              <div className='w-full'>
                Network:
                <NetworkSwitcher currentChainId={account.chainId} />
              </div>
              <button
                onClick={() => {
                  disconnect();
                  router.push('/');
                }}
                className='flex w-full items-center justify-center lg:justify-start mt-4 lg:mt-8 underline'
                id='disconnect'
              >
                Sign Out{' '}
                <ArrowRightStartOnRectangleIcon className='ml-1 h-5 w-5' />
              </button>
            </div>
          </div>
          <div
            className={`w-full h-full ${
              searchParams.get('state') === 'deposit' ? 'block' : 'hidden'
            }`}
          >
            {dappNode ? (
              <DappnodeDeposit
                contractConfig={contractConfig}
                address={account.address || '0x0'}
                chainId={chainId}
              />
            ) : (
              <Deposit
                contractConfig={contractConfig}
                address={account.address || '0x0'}
                chainId={chainId}
              />
            )}
          </div>
          <div
            className={`w-full ${
              searchParams.get('state') === 'consolidate' ? 'block' : 'hidden'
            }`}
          >
            <Consolidate
              contractConfig={contractConfig}
              address={account.address}
              chainId={chainId}
            />
          </div>
          <div
            className={`w-full h-full ${
              searchParams.get('state') === 'withdrawal' ? 'block' : 'hidden'
            }`}
          >
            <Withdrawal
              contractConfig={contractConfig}
              address={account.address || '0x0'}
              chainId={chainId}
            />
          </div>
          <div
            className={`w-full h-full ${
              searchParams.get('state') === 'validator' ? 'block' : 'hidden'
            }`}
          >
            <Validator
              contractConfig={contractConfig}
              address={account.address}
            />
          </div>
        </div>
      </div>
    </Suspense>
  );
}
