import { Validator } from '@/hooks/use-consolidate';
import { truncateAddress } from '@/utils/truncateAddress';
import {
  Listbox,
  ListboxButton,
  ListboxOptions,
  ListboxOption,
} from '@headlessui/react';
import { useState } from 'react';

interface ConsolidateSelectProps {
  validators: Validator[];
}

export function ConsolidateSelect({ validators }: ConsolidateSelectProps) {
  const [selectedPubkeys, setSelectedPubkeys] = useState<string[]>([]);
  const [consolidateTarget, setConsolidateTarget] = useState<string>(validators[0].publickey);
  return (
    <div className='w-full flex flex-col items-center justify-center gap-y-2'>
      <p className='text-xs'>This is a preview of the consolidate feature. Please select the validators you would like to consolidate and the target validator to consolidate to. (no design yet)</p>
      <div className='w-full flex justify-between items-center gap-x-4'>
        <Listbox value={selectedPubkeys} onChange={setSelectedPubkeys} multiple>
          <ListboxButton className='flex items-center justify-between w-full rounded-lg bg-[#e6e1d3] p-2 font-bold text-black'>
            {selectedPubkeys
              .map((pubkey) => truncateAddress(pubkey))
              .join(', ')}
          </ListboxButton>
          <ListboxOptions anchor='bottom'>
            {validators.map((validator) => (
              <ListboxOption 
                key={validator.publickey}
                value={validator.publickey}
                className='rounded-xl mt-1 text-black bg-[#e6e1d3] p-1 shadow-md focus:outline-none'
              >
                {truncateAddress(validator.publickey)}
              </ListboxOption>
            ))}
          </ListboxOptions>
        </Listbox>
        <Listbox value={consolidateTarget} onChange={setConsolidateTarget}>
          <ListboxButton className='flex items-center justify-between w-full rounded-lg bg-[#e6e1d3] p-2 font-bold text-black'>
            {truncateAddress(consolidateTarget)}
          </ListboxButton>
          <ListboxOptions anchor='bottom'>
            {validators.map((validator) => (
              <ListboxOption 
                key={validator.publickey}
                value={validator.publickey}
                className='rounded-xl mt-1 text-black bg-[#e6e1d3] p-1 shadow-md focus:outline-none'
              >
                {truncateAddress(validator.publickey)}
              </ListboxOption>
            ))}
          </ListboxOptions>
        </Listbox>
      </div>
    </div>
  );
}
