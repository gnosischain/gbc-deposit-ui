"use client";

import useDappnodeDeposit, {
  DepositDataJson,
} from "@/hooks/use-dappnode-deposit";
import { CheckIcon, InformationCircleIcon } from "@heroicons/react/20/solid";
import Image from "next/image";
import Link from "next/link";
import {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useState,
} from "react";
import { FileRejection, useDropzone } from "react-dropzone";
import { Address } from "viem";
import Loader from "./loader";

export type DappnodeUser = {
  safe: string;
  status: Step;
  expectedDepositCount: number;
  totalStakeAmount: number;
};

type Step =
  | "notIncluded"
  | "pending"
  | "submitted"
  | "validation"
  | "executed"
  | undefined;

export default function DappnodeDeposit() {
  const [loading, setLoading] = useState(true);
  const [step, setStep] = useState<Step>();
  const [errorMessage, setErrorMessage] = useState("");

  const {
    setDappnodeDepositData,
    depositData,
    depositSuccess,
    depositHash,
    user,
    dappnodeDeposit,
    isWrongNetwork,
  } = useDappnodeDeposit();

  useEffect(() => {
    if (isWrongNetwork !== undefined) {
      setLoading(false);
    }
  }, [isWrongNetwork]);

  const [tx, setTx] = useState<Address>("0x0");

  useEffect(() => {
    if (user) {
      if (user[0] === "0x0000000000000000000000000000000000000000") {
        setStep("notIncluded");
      } else {
        if (user[1] === 0) {
          setStep("pending");
        } else if (user[1] === 1) {
          setStep("submitted");
        } else if (user[1] === 2) {
          setStep("executed");
        }
      }
    }
  }, [user]);

  useEffect(() => {
    if (depositSuccess) {
      setLoading(false);
      setStep("submitted");
    }
  }, [depositSuccess]);

  useEffect(() => {
    if (depositHash) {
      setTx(depositHash);
    }
  }, [depositHash]);

  return (
    <div className="w-full bg-[#FFFFFFB2] p-3 flex flex-col justify-center items-center rounded-2xl">
      {loading ? (
        <>
          <Loader />
          <p className="mt-2">Loading...</p>
        </>
      ) : isWrongNetwork ? (
        <div className="flex flex-col w-full h-full justify-evenly text-center text-red-400 font-bold text-lg">
          To claim Dappnode&apos;s GNO Incentive Programm connect your wallet
          provider to Gnosis Chain!
        </div>
      ) : step === "notIncluded" ? (
        <AddressNotIncluded />
      ) : step === "pending" ? (
        <PendingStatus
          safeAddress={user ? user[0] : ""}
          setLoading={setLoading}
          setStep={setStep}
          errorMessage={errorMessage}
          setErrorMessage={setErrorMessage}
          setDappnodeDepositData={setDappnodeDepositData}
        />
      ) : step === "validation" ? (
        <Validation
          setLoading={setLoading}
          depositData={depositData}
          dappnodeDeposit={dappnodeDeposit}
        />
      ) : step === "submitted" ? (
        <SubmittedStatus tx={tx} />
      ) : step === "executed" ? (
        <ExecutedStatus safeAddress={user ? user[0] : ""} />
      ) : (
        ""
      )}
    </div>
  );
}

function AddressNotIncluded() {
  return (
    <div className="flex flex-col w-full h-full justify-evenly   text-center">
      {" "}
      <p className="text-red-400 font-bold text-lg">
        The wallet address provided is not included in Dappnode&apos;s GNO
        Incentive Program!
      </p>{" "}
      <p>Please, ensure you have connected with the correct address</p>
    </div>
  );
}

function PendingStatus({
  setLoading,
  setStep,
  safeAddress,
  errorMessage,
  setErrorMessage,
  setDappnodeDepositData,
}: {
  safeAddress: string;
  setLoading: Dispatch<SetStateAction<boolean>>;
  setStep: Dispatch<SetStateAction<Step>>;
  errorMessage: string;
  setErrorMessage: Dispatch<SetStateAction<string>>;
  setDappnodeDepositData: (fileData: string, filename: string) => Promise<void>;
}) {
  let formattedSafe = "0x" + safeAddress.slice(-40);

  const onDrop = useCallback(
    async (acceptedFiles: File[], rejectedFiles: FileRejection[]) => {
      if (rejectedFiles.length > 0) {
        setErrorMessage("Please upload a valid JSON file.");
      } else if (acceptedFiles.length > 0) {
        const reader = new FileReader();
        reader.onload = async (event) => {
          const result = event.target?.result as string;
          console.log(result);
          if (result) {
            try {
              setLoading(true);
              await setDappnodeDepositData(result, acceptedFiles[0].name);
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
    },
    [setDappnodeDepositData, errorMessage]
  );

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: { "application/json": [] },
    maxFiles: 1,
  });
  return (
    <div className="w-full h-full flex flex-col items-center justify-evenly">
      <span className="text-sm">
        {" "}
        Your Safe address is{" "}
        <span className="text-green text-xs">{formattedSafe}</span>
      </span>
      <div
        className="w-full flex flex-col items-center hover:cursor-pointer"
        {...getRootProps()}
      >
        <input {...getInputProps()} />
        Upload deposit date file
        <div className="flex font-bold items-center">
          deposit_data.json <InformationCircleIcon className="ml-px h-5 w-5" />
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
          <p className="text-red-400 text-sm text-center">
            {errorMessage.substring(0, 150)}
          </p>
        )}
      </div>
    </div>
  );
}

function Validation({
  setLoading,
  depositData,
  dappnodeDeposit,
}: {
  setLoading: Dispatch<SetStateAction<boolean>>;
  depositData: {
    deposits: DepositDataJson[];
    filename: string;
    hasDuplicates: boolean;
    isBatch: boolean;
  };
  dappnodeDeposit: () => Promise<void>;
}) {
  const onDeposit = useCallback(async () => {
    setLoading(true);
    await dappnodeDeposit();
  }, [depositData]);

  return (
    <div className="w-full flex flex-col items-center">
      {depositData.filename}
      <div className="flex items-center mt-4">
        <CheckIcon className="h-5 w-5" /> File accepted
      </div>
      <div className="flex items-center">
        <CheckIcon className="h-5 w-5" /> Safe address as Withdrawal
      </div>
      <div className="flex items-center">
        <CheckIcon className="h-5 w-5" /> Validator deposits:{" "}
        {depositData.deposits.length}
      </div>
      <div className="flex items-center">
        <CheckIcon className="h-5 w-5" /> Total amount requested:{" "}
        {depositData.deposits.length} GNO
      </div>
      {depositData.isBatch ? (
        ""
      ) : (
        <p className="text-orange-400 text-xs text-center">
          Your deposit file contains BLS credentials (starting with 0x00). You
          can generate the keys again, specifying the safe that we provided to
          you as withdrawal credentials.
        </p>
      )}
      <button
        className="bg-[#DD7143] px-4 py-1 rounded-full text-white mt-4 text-lg font-semibold"
        onClick={onDeposit}
      >
        Claim
      </button>
    </div>
  );
}

function SubmittedStatus({ tx }: { tx: `0x${string}` }) {
  return (
    <div className="flex flex-col justify-evenly text-center h-full">
      <div className="text-lg font-bold text-green">
        Your claim has been submitted!
      </div>
      <div>
        {" "}
        Check the transaction
        <Link
          href={"https://gnosis.blockscout.com/tx/" + tx}
          target="_blank"
          className="text-[#DD7143] underline ml-1"
        >
          here.
        </Link>
      </div>
      <div>
        Dappnode&apos;s team will check and execute your claim to your safe
        address. This is executed at least once a week.
      </div>
      <div>Make sure your keystores are already in your Dappnode.</div>
      <div>Once it&apos;s done you will be able to check it in this UI.</div>
    </div>
  );
}

function ExecutedStatus({ safeAddress }: { safeAddress: string }) {
  let formattedSafe = "0x" + safeAddress.slice(-40);

  return (
    <div className="w-full flex flex-col items-center">
      <div className="flex items-center flex-col gap-5 text-center">
        <div className="text-lg font-bold text-green">
          Your deposit has been executed!
        </div>
        <span className="t">
          {" "}
          Your Safe address is{" "}
          <span className="text-green text-xs">{formattedSafe}</span>
        </span>
        <div>Ensure you keystores are already in your Dappnode to start validating.</div>
      </div>
    </div>
  );
}
