import { Button } from '@headlessui/react';

export function Balance() {

  return (
    <div className='flex items-center justify-center'>
      <div className='bg-white p-8 rounded-lg'>
        <h1 className='text-2xl font-bold'>Wrong Network</h1>
        <p className='mt-4'>
          Please switch to the correct network to continue.
        </p>
        <Button
          onClick={() => {}}
          className='mt-4 bg-accent text-white rounded-lg px-4 py-2'
        >
          Switch to Gnosis Chain
        </Button>
      </div>
    </div>
  );
}
