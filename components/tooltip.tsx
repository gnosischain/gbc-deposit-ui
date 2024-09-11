"use client";

import { Popover, PopoverButton, PopoverPanel } from "@headlessui/react";
import { InformationCircleIcon } from "@heroicons/react/20/solid";
import { useState, useRef, useEffect } from "react";

interface ToolTipProps {
  text: React.ReactNode;
}

export default function ToolTip({ text }: ToolTipProps) {
  const [isOpen, setIsOpen] = useState(false);
  const popoverButtonRef = useRef<HTMLButtonElement>(null);

  const handleMouseEnter = () => {
    setIsOpen(true);
  };

  const handleMouseLeave = () => {
    setIsOpen(false);
  };

  useEffect(() => {
    const current = popoverButtonRef.current;
    if (!current) {
      return;
    }

    const observer = new MutationObserver((mutations) => {
      const hovered = mutations.find(
        ({ attributeName }) => attributeName === "data-hover"
      );
      const active = current.hasAttribute("data-active");

      if (hovered && !active) {
        current.click();
      }
    });

    observer.observe(current, { attributes: true });

    return () => {
      observer.disconnect();
    };
  }, [popoverButtonRef]);

  return (
    <Popover className="relative" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
      <PopoverButton ref={popoverButtonRef} className="focus:outline-none">
        <InformationCircleIcon className="h-5 w-5" />
      </PopoverButton>
      {isOpen && (
        <PopoverPanel
          anchor="top"
          className="flex bg-accent/80 rounded-full py-1 px-2 text-sm mb-2 [--anchor-gap:4px]"
        >
          {text}
        </PopoverPanel>
      )}
    </Popover>
  );
}
