"use client";

import { InformationCircleIcon } from "@heroicons/react/20/solid";
import Image from "next/image";
import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { FileRejection } from "react-dropzone";
import Loader from "./loader";
import useValidators, { FileDepositData } from "@/hooks/use-validators";

export default function Validator() {
  const { validateStatus, statuses } = useValidators();
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState("validation");

  const onDrop = useCallback(
    async (acceptedFiles: File[], rejectedFiles: FileRejection[]) => {
      if (rejectedFiles.length > 0) {
        setErrorMessage("Please upload a valid JSON file.");
      } else if (acceptedFiles.length > 0) {
        const data = await Promise.all(
          acceptedFiles.map(
            (file) =>
              new Promise<FileDepositData>((resolve) => {
                const reader = new FileReader();
                reader.onload = async (event) => {
                  if (event.target?.result) {
                    const depositData = JSON.parse(event.target.result as string);
                    resolve({
                      fileName: file.name,
                      data: depositData,
                    });
                  }
                };
                reader.readAsText(file);
              })
          )
        );
        try {
          setLoading(true);
          await validateStatus(data);
          setStep("validated");
          setLoading(false);
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
    },
    [validateStatus]
  );
  const { getRootProps, getInputProps } = useDropzone({ onDrop, accept: { "application/json": [] } });

  return (
    <div className="w-full bg-[#FFFFFFB2] h-[280px] p-6 flex flex-col justify-center items-center rounded-2xl">
      {loading ? (
        <>
          <Loader />
          <p className="mt-2">Loading...</p>
        </>
      ) : step === "validation" ? (
        <div className="w-full flex flex-col items-center hover:cursor-pointer" {...getRootProps()}>
          <input {...getInputProps()} />
          Upload deposit date file
          <div className="flex font-bold items-center">
            deposit_data.json <InformationCircleIcon className="ml-px h-5 w-5" />
          </div>
          <Image src="/drop.svg" alt="Drop" width={80} height={24} className="my-8 rounded-full shadow-lg" />
          <div>Drag file to upload or browse</div>
          {errorMessage && <p className="text-red-400 text-sm">{errorMessage.substring(0, 150)}</p>}
        </div>
      ) : step === "validated" ? (
        <div className="w-full h-full flex flex-col items-center">
          {statuses && statuses.length > 0 ? (
            <div className="overflow-y-auto">
              {statuses.map((status, index) => (
                <div key={index}>
                  <h2>
                    {status.name} - {status.pubkey.slice(0, 26)}
                  </h2>
                  <p>Status: {status.status}</p>
                </div>
              ))}
            </div>
          ) : (
            <p>Your validators may be initialising. Check them in the Beacon Chain Explorer.</p>
          )}
        </div>
      ) : (
        ""
      )}
    </div>
  );
}
