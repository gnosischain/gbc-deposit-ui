"use client";

import useDeposit from "@/hooks/use-deposit";
import { InformationCircleIcon } from "@heroicons/react/20/solid";
import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import { FileRejection } from "react-dropzone";

export default function Deposit() {
  const { setDepositData } = useDeposit();
  const [errorMessage, setErrorMessage] = useState("");
  const onDrop = useCallback(async (acceptedFiles: File[], rejectedFiles: FileRejection[]) => {
    if (rejectedFiles.length > 0) {
      setErrorMessage("Please upload a valid JSON file.");
    } else if (acceptedFiles.length > 0) {
      const reader = new FileReader();
      reader.onload = async (event) => {
        const result = event.target?.result as string;
        if (result) {
          try {
            await setDepositData(result, acceptedFiles[0].name);
            setErrorMessage("");
          } catch (error: unknown) {
            console.log(error);
            if (error instanceof Error) {
              setErrorMessage(error.message);
            } else {
              setErrorMessage("An unexpected error occurred.");
            }
          }
        }
      };
      reader.readAsText(acceptedFiles[0]);
    }
  }, []);
  const { getRootProps, getInputProps } = useDropzone({ onDrop, accept: { "application/json": [] }, maxFiles: 1 });

  return (
    <div className="w-full bg-[#FFFFFFB2] h-[280px] p-6 flex flex-col items-center rounded-2xl hover:cursor-pointer" {...getRootProps()}>
      <input {...getInputProps()} />
      Upload deposit date file
      <div className="flex font-bold items-center">
        deposit_data.json <InformationCircleIcon className="ml-px h-5 w-5" />
      </div>
      <Image src="/drop.svg" alt="Drop" width={80} height={24} className="my-8 rounded-full shadow-lg" />
      <div>Drag file to upload or browse</div>
      {errorMessage && <p className="text-red-400 text-sm">{errorMessage}</p>}
    </div>
  );
}
