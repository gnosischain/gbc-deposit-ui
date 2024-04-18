"use client";

import useDeposit from "@/hooks/use-deposit";
import { InformationCircleIcon } from "@heroicons/react/20/solid";
import Image from "next/image";
import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { FileRejection } from "react-dropzone";
import Loader from "./loader";
import { CheckIcon } from "@heroicons/react/24/outline";

export default function Deposit() {
  const { setDepositData, depositData, deposit } = useDeposit();
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState("deposit");
  const onDrop = useCallback(async (acceptedFiles: File[], rejectedFiles: FileRejection[]) => {
    if (rejectedFiles.length > 0) {
      setErrorMessage("Please upload a valid JSON file.");
    } else if (acceptedFiles.length > 0) {
      const reader = new FileReader();
      reader.onload = async (event) => {
        const result = event.target?.result as string;
        if (result) {
          try {
            setLoading(true);
            await setDepositData(result, acceptedFiles[0].name);
            setStep("validation");
            setLoading(false);
            setErrorMessage("");
          } catch (error: unknown) {
            console.log(error);
            setLoading(false);
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
    <div className="w-full bg-[#FFFFFFB2] h-[280px] p-6 flex flex-col justify-center items-center rounded-2xl">
      {loading ? (
        <>
          <Loader />
          <p className="mt-2">Loading...</p>
        </>
      ) : step === "deposit" ? (
        <div className="w-full flex flex-col items-center hover:cursor-pointer" {...getRootProps()}>
          <input {...getInputProps()} />
          Upload deposit date file
          <div className="flex font-bold items-center">
            deposit_data.json <InformationCircleIcon className="ml-px h-5 w-5" />
          </div>
          <Image src="/drop.svg" alt="Drop" width={80} height={24} className="my-8 rounded-full shadow-lg" />
          <div>Drag file to upload or browse</div>
          {errorMessage && <p className="text-red-400 text-sm">{errorMessage.substring(0,150)}</p>}
        </div>
      ) : step === "validation" ? (
        <div className="w-full flex flex-col items-center">
          {depositData.filename}
          <div className="flex items-center mt-4">
            <CheckIcon className="h-5 w-5" /> Accepted
          </div>
          <div className="flex items-center">
            <CheckIcon className="h-5 w-5" /> Validator deposits: {depositData.deposits.length}
          </div>
          <div className="flex items-center">
            <CheckIcon className="h-5 w-5" /> Total amount required: {depositData.deposits.length} GNO
          </div>
          <button className="bg-[#DD7143] px-4 py-1 rounded-full text-white mt-4 text-lg font-semibold" onClick={deposit}>
            Deposit
          </button>
        </div>
      ) : (
        ""
      )}
    </div>
  );
}
