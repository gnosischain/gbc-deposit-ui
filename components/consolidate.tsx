// 'use client';

// import { useEffect, useState } from 'react';
// import Loader from './loader';
// import { ContractNetwork } from '@/utils/contracts';
// import { ConsolidateInfo } from './consolidateInfo';
// import {
//   fetchChiadoValidators,
//   fetchValidators,
//   useConsolidateValidators,
//   Validator,
// } from '@/hooks/useConsolidate';
// import { ConsolidateSelect } from './consolidateSelect';

// interface ConsolidateProps {
//   contractConfig: ContractNetwork;
//   address: `0x${string}`;
//   chainId: number;
// }

// enum Steps {
//   INFO = 'info',
//   SELECT = 'select',
//   SUMMARY = 'summary',
// }

// export default function Consolidate({
//   contractConfig,
//   address,
//   chainId,
// }: ConsolidateProps) {
//   const { consolidateValidators } = useConsolidateValidators(
//     contractConfig,
//     address
//   );

//   const [validators, setValidators] = useState<Validator[]>([]);
//   const [state, setState] = useState<{
//     step: Steps;
//     loading: boolean;
//     tx: `0x${string}`;
//   }>({
//     step: Steps.INFO,
//     loading: false,
//     tx: '0x0',
//   });

//   useEffect(() => {
//     const fetchValidatorData = async () => {
//       setState((prev) => ({ ...prev, loading: true }));
//       try {
//         if (contractConfig?.beaconExplorerUrl && address) {
//           const data = chainId === 10200 ? await fetchChiadoValidators(address) : await fetchValidators(
//             contractConfig.beaconExplorerUrl,
//             '0x78E87757861185Ec5e8C0EF6BF0C69Fa7832df6C'
//           );
//           setValidators(data);
//         } else {
//           throw new Error('Beacon Explorer URL is undefined');
//         }
//       } catch (err) {
//         console.log('Error fetching validators:', err, address);
//       } finally {
//         setState((prev) => ({ ...prev, loading: false }));
//       }
//     };

//     fetchValidatorData();
//   }, [address, chainId, contractConfig.beaconExplorerUrl]);

//   const renderStep = () => {
//     switch (state.step) {
//       case Steps.INFO:
//         return (
//           <ConsolidateInfo
//             pubkeysAmount={validators.length}
//             goToStep={() =>
//               setState((prev) => ({ ...prev, step: Steps.SELECT }))
//             }
//           />
//         );
//       case Steps.SELECT:
//         return (
//           <ConsolidateSelect
//             validators={validators}
//             consolidateValidators={consolidateValidators}
//           />
//         );
//     }
//   };

//   return (
//     <div className='w-full h-full bg-[#FFFFFFB2] flex flex-col justify-center items-center rounded-2xl'>
//       {state.loading ? (
//         <>
//           <Loader />
//           <p className='mt-2'>Loading...</p>
//         </>
//       ) : (
//         renderStep()
//       )}
//     </div>
//   );
// }
