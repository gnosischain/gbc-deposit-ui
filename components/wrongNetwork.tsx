import { Button } from '@headlessui/react';
import { useSwitchChain } from 'wagmi';

export function WrongNetwork() {
  const { switchChain } = useSwitchChain();

  return (
    <div className='absolute top-0 z-20 w-screen h-screen bg-black/50 flex text-black items-center justify-center'>
      <div className='bg-white p-8 rounded-lg'>
        <h1 className='text-2xl font-bold'>Wrong Network</h1>
        <p className='mt-4'>
          Please switch to the correct network to continue.
        </p>
        <Button
          onClick={() => switchChain({ chainId: 100 })}
          className='mt-4 bg-accent text-white rounded-lg px-4 py-2'
        >
          Switch to Gnosis Chain
        </Button>
      </div>
    </div>
  );
}
