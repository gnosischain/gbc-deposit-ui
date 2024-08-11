"use client"; //TODO move down suspense into components

import Image from "next/image";
import DropDown from "@/components/dropdown";
import NavigationTab from "@/components/navigation-tab";
import Link from "next/link";
import Dashboard from "@/components/dashboard";
import { Suspense } from "react";

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <main className='flex min-h-screen lg:h-screen flex-col items-center justify-center'>
        <div className='w-full lg:w-[775px] bg-[#133629CC] h-full md:h-full lg:h-auto backdrop-blur-sm p-4 lg:rounded-2xl flex gap-y-6 flex-col justify-start items-center'>
          <div className='w-full gap-x-4 flex justify-between'>
            <NavigationTab value='deposit' />
            <NavigationTab value='withdrawal' />
            <NavigationTab value='validator' />
          </div>
          <Dashboard />
          <div className='w-full flex flex-col-reverse sm:flex-row justify-between'>
            <div className='flex justify-center sm:justify-start mt-4 sm:mt-0'>
              <Image src='/logo.svg' alt='Gnosis Logo' width={45} height={24} />
              <div className='flex flex-col ml-2 justify-center'>
                <Image
                  src='/gnosis.svg'
                  alt='Gnosis Text'
                  width={100}
                  height={24}
                  className='mb-1 mt-0.5'
                />
                <p className='text-[6px] leading-[6px] sm:text-[8px] sm:leading-[8px] mt-1 '>
                  BEACON CHAIN DEPOSIT
                </p>
              </div>
            </div>

            <div className='flex flex-1'>
              <Link
                target='_blank'
                className='flex flex-1 justify-center text-sm lg:text-base items-center underline hover:text-slate-200'
                href={'https://docs.gnosischain.com/node/'}
              >
                Learn more about the Gnosis Beacon Chain
              </Link>
              <div className='flex justify-center items-center'>
                <DropDown />
              </div>
            </div>
          </div>
        </div>
      </main>
    </Suspense>
  );
}
