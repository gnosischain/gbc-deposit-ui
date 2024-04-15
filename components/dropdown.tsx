"use client";

import { Menu, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { ChevronDownIcon } from "@heroicons/react/20/solid";

export default function DropDown() {
  return (
    <div className="w-56 text-right">
      <Menu as="div" className="relative inline-block text-left">
        <div>
          <Menu.Button className="inline-flex w-full justify-center rounded-md bg-white text-black px-4 py-2 text-xs lg:text-sm font-medium hover:bg-white/30 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/75">
            Stay Updated
            <ChevronDownIcon className="-mr-1 ml-2 h-5 w-5 text-violet-200 hover:text-violet-100" aria-hidden="true" />
          </Menu.Button>
        </div>
        <Transition as={Fragment} enter="transition ease-out duration-100" enterFrom="transform opacity-0 scale-95" enterTo="transform opacity-100 scale-100" leave="transition ease-in duration-75" leaveFrom="transform opacity-100 scale-100" leaveTo="transform opacity-0 scale-95">
          <Menu.Items className="absolute right-0 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black/5 focus:outline-none">
            <div className="px-1 py-1 ">
              <Menu.Item>{({ active }) => <button className={`${active ? "bg-stone-100" : ""} text-gray-900 group flex w-full items-center rounded-md px-2 py-2 text-sm`}>FAQ</button>}</Menu.Item>
              <Menu.Item>{({ active }) => <button className={`${active ? "bg-stone-100" : ""} text-gray-900 group flex w-full items-center rounded-md px-2 py-2 text-sm`}>Official Docs</button>}</Menu.Item>
              <Menu.Item>{({ active }) => <button className={`${active ? "bg-stone-100" : ""} text-gray-900 group flex w-full items-center rounded-md px-2 py-2 text-sm`}>Validator Newsletter</button>}</Menu.Item>
              <Menu.Item>{({ active }) => <button className={`${active ? "bg-stone-100" : ""} text-gray-900 group flex w-full items-center rounded-md px-2 py-2 text-sm`}>Gnosis Chain Discord</button>}</Menu.Item>
            </div>
          </Menu.Items>
        </Transition>
      </Menu>
    </div>
  );
}
