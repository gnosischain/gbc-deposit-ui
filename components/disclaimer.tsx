'use client';
import { useState } from 'react';

export function DisclaimerBanner() {
  const [visible, setVisible] = useState(true);
  if (!visible) return null;

  return (
    <div className='fixed bottom-0 w-full bg-yellow-100 border-t border-yellow-400 p-3 text-sm text-yellow-800 flex justify-between items-center z-50'>
      <span>
        ⚠️ Disclaimer: Use this app at your own risk. Gnosis is not responsible
        for any losses and you must review every transaction before accepting
        it.
      </span>
      <button
        onClick={() => setVisible(false)}
        className='ml-4 px-2 py-1 bg-yellow-200 hover:bg-yellow-300 rounded'
      >
        Dismiss
      </button>
    </div>
  );
}
