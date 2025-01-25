"use client";

import useDeposit from "@/hooks/use-deposit";
import {
  ArrowUturnLeftIcon,
  CheckIcon,
} from "@heroicons/react/20/solid";
import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import { FileRejection } from "react-dropzone";
import Loader from "./loader";
import Link from "next/link";
import { ContractNetwork } from "@/utils/contracts";
import ToolTip from "./tooltip";

interface DepositProps {
  contractConfig: ContractNetwork | undefined;
  address: `0x${string}` | undefined;
  chainId: number;
}

export default function Deposit({
  contractConfig,
  address,
  chainId,
}: DepositProps) {
  const { setDepositData, depositData, deposit, depositSuccess, depositHash } =
    useDeposit(contractConfig, address, chainId);
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [tx, setTx] = useState<`0x${string}`>("0x0");
  const [step, setStep] = useState("deposit");
  const onDrop = useCallback(
    async (acceptedFiles: File[], rejectedFiles: FileRejection[]) => {
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
                console.log(error);
                setErrorMessage(error.message);
              } else {
                setErrorMessage("An unexpected error occurred.");
              }
            }
          }
        };
        reader.readAsText(acceptedFiles[0]);
      }
    },
    [setDepositData]
  );

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: { "application/json": [] },
    maxFiles: 1,
  });

  const onDeposit = useCallback(async () => {
    setLoading(true);
    await deposit();
  }, [deposit]);

  useEffect(() => {
    if (depositSuccess) {
      setLoading(false);
      setStep("summary");
    }
  }, [depositSuccess]);

  useEffect(() => {
    if (depositHash) {
      setTx(depositHash);
    }
  }, [depositHash]);

  return (
    <div className="w-full h-full bg-[#FFFFFFB2] flex flex-col justify-center items-center rounded-2xl">
      {loading ? (
        <>
          <Loader />
          <p className="mt-2">Loading...</p>
        </>
      ) : step === "deposit" ? (
        <div
          className="w-full h-full flex flex-col items-center justify-center hover:cursor-pointer"
          {...getRootProps()}
        >
          <input id="dropzone" {...getInputProps()} />
          Upload deposit date file
          <div className="flex font-bold items-center gap-x-1">
            deposit_data.json{" "}
            <ToolTip
              text={
                <p>
                  See{" "}
                  <a href="https://docs.gnosischain.com/node/manual/validator/generate-keys/" className="underline">
                    here
                  </a>{" "}
                  to learn how to generate the file.
                </p>
              }
            />
          </div>
          <Image
            src="/drop.svg"
            alt="Drop"
            width={80}
            height={24}
            className="my-8 rounded-full shadow-lg"
          />
          <div>Drag file to upload or browse</div>
          {errorMessage && (
            <p className="text-red-400 text-sm" id="error">
              {errorMessage.substring(0, 150)}
            </p>
          )}
        </div>
      ) : step === "validation" ? (
        <div className="w-full flex flex-col items-center">
          <div id="filename">{depositData.filename}</div>
          <div className="flex items-center mt-4">
            <CheckIcon className="h-5 w-5" /> Accepted
          </div>
          <div className="flex items-center">
            <CheckIcon className="h-5 w-5" /> Validator deposits:{" "}
            {depositData.deposits.length}
          </div>
          <div className="flex items-center">
            <CheckIcon className="h-5 w-5" /> Total amount required:{" "}
            {depositData.deposits.length} GNO
          </div>
          {depositData.isBatch ? (
            ""
          ) : (
            <p className="text-orange-400 text-xs text-center">
              Your deposit file contains BLS credentials (starting with 0x00),
              you&apos;ll be asked to sign a transaction for each of them.
              Alternatively you can generate the keys again, make sure to
              specify an eth1 address for the withdrawal credentials.
            </p>
          )}
          <button
            className="bg-accent px-4 py-1 rounded-full text-white mt-4 text-lg font-semibold"
            onClick={onDeposit}
            id="depositButton"
          >
            Deposit
          </button>
        </div>
      ) : step === "summary" ? (
        <div className="w-full flex flex-col items-center">
          <div className="flex items-center" id="confirmation">
            <CheckIcon className="h-5 w-5" /> Your transaction is completed !
            View it
            <Link
              href={contractConfig?.blockExplorerUrl + "tx/" + tx} 
              target="_blank"
              className="text-accent underline ml-1"
            >
              here
            </Link>
            .
          </div>
          <button
            className="text-accent flex items-center px-4 py-1 rounded-full mt-4 text-base font-semibold"
            onClick={() => setStep("deposit")}
          >
            Back <ArrowUturnLeftIcon className="h-4 w-4 ml-2" />
          </button>
        </div>
      ) : (
        ""
      )}
    </div>
  );
}
