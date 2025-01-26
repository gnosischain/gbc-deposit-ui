interface ConsolidateInfoProps {
  pubkeysAmount: number;
  goToStep: () => void;
}

export function ConsolidateInfo({
  pubkeysAmount,
  goToStep,
}: ConsolidateInfoProps) {
  return (
    <div className='w-full flex flex-col items-center justify-center gap-y-2'>
      <div className='text-center'>
        You can consolide multiple validators into a fewer ones and reduce the
        cost of maintaining them. Add more information here.
      </div>
      {pubkeysAmount > 0 ? (
        <>
          <p className="font-bold">You have {pubkeysAmount} public keys to consolidate.</p>
          <button
            className='bg-accent px-4 py-1 rounded-full text-white mt-4 text-md font-semibold'
            onClick={() => goToStep()}
            id='consolidate'
          >
            Consolidate
          </button>
        </>
      ) : (
        <div className='text-center mt-4'>
          You don&apos;t have any public keys to consolidate at the moment.
        </div>
      )}
    </div>
  );
}
