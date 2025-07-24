import { useCallback, useState, useEffect } from "react";
import {
  useWriteContract,
  useWaitForTransactionReceipt,
} from "wagmi";
import { formatUnits } from "viem";
import useBalance from "./useBalance";
import { useClient } from "urql";
import { CredentialType } from "@/types/validators";
import { generateDepositData, GET_DEPOSIT_EVENTS, getCredentialType } from "@/utils/deposit";
import DEPOSIT_ABI from "@/utils/abis/deposit";
import ERC677ABI from "@/utils/abis/erc677";
import { ContractNetwork } from "@/utils/contracts";
import { DepositDataJson } from "@/types/deposit";

function useDeposit(contractConfig: ContractNetwork, address: `0x${string}`, chainId: number) {
  const [deposits, setDeposits] = useState<DepositDataJson[]>([]);
  const [totalDepositAmount, setTotalDepositAmount] = useState<bigint>(0n);
  const { balance, refetchBalance } = useBalance(contractConfig, address);
  
  const { data: approveHash, error: approveContractError, writeContract: writeApproveContract } = useWriteContract();
  const { data: depositHash, error: depositContractError, writeContract: writeDepositContract } = useWriteContract();
  
  const { isSuccess: approveSuccess, error: approveTxError } = useWaitForTransactionReceipt({
    hash: approveHash,
  });
  const { isSuccess: depositSuccess, error: depositTxError } = useWaitForTransactionReceipt({
    hash: depositHash,
  });

  const client = useClient();
  const [isApproved, setIsApproved] = useState(false);
  const validate = useCallback(
    async (deposits: DepositDataJson[], balance: bigint) => {

      const isValidJson = deposits.every((d) =>
        ["pubkey", "withdrawal_credentials", "amount", "signature", "deposit_message_root", "deposit_data_root", "fork_version"].every((key) => key in d)
      );
      if (!isValidJson) throw Error("Invalid JSON structure.");

      if (!deposits.every((d) => d.fork_version === contractConfig.forkVersion)) {
        throw Error(`File is for the wrong network. Expected: ${chainId}`);
      }

      const pubkeys = deposits.map((d) => `0x${d.pubkey}`);
      const { data, error } = await client.query(GET_DEPOSIT_EVENTS, {
        pubkeys: pubkeys,
        chainId: chainId,
      });

      if (error) {
        throw Error(`Failed to fetch existing deposits: ${error.message}`);
      }

      if (!data || !data.SBCDepositContract_DepositEvent) {
        throw Error("Invalid response from deposit query");
      }

      const existingDeposits = new Set(
        data.SBCDepositContract_DepositEvent.map((d: { pubkey: string }) => d.pubkey)
      );

      let validDeposits: DepositDataJson[];


      validDeposits = deposits.filter((d) => !existingDeposits.has('0x' + d.pubkey));

      if (validDeposits.length === 0) throw Error("Deposits have already been made to all validators in this file.");

      if (validDeposits.length !== deposits.length) {
        throw Error(
          "Some of the deposits have already been made to the validators in this file."
        );
      }

      const uniquePubkeys = new Set(validDeposits.map((d) => d.pubkey));
      if (uniquePubkeys.size !== validDeposits.length) {
        throw Error("Duplicated public keys detected in the deposit file.");
      }

      const credentials = deposits[0].withdrawal_credentials;
      const credentialType = getCredentialType(credentials);

      if (!validDeposits.every((d) => d.withdrawal_credentials === credentials)) {
        throw Error("All validators in the file must have the same withdrawal credentials.");
      }

      const _totalDepositAmount = validDeposits.reduce((acc, deposit) => acc + BigInt(deposit.amount), 0n);

      if (balance < _totalDepositAmount) {
        throw Error(`Unsufficient balance. ${Number(formatUnits(_totalDepositAmount, 9))} GNO is required.
      `);
      }

      return { deposits: validDeposits, credentialType, _totalDepositAmount };
    },
    [contractConfig, client, chainId]
  );

  const setDepositData = useCallback(
    async (file: File) => {
      if (file) {
        let data: DepositDataJson[] = [];
        try {
          data = JSON.parse(await file.text());
        } catch (error) {
          throw new Error(`Oops, something went wrong while parsing your json file. Please check the file and try again. ${error}`);
        }
        if (balance === undefined) {
          throw Error("Balance not loaded correctly.");
        }
        const { deposits, credentialType, _totalDepositAmount } = await validate(
          data,
          balance
        );
        setDeposits(deposits);
        setTotalDepositAmount(_totalDepositAmount);
        return credentialType;
      }
    },
    [validate, balance]
  );

  const deposit = useCallback(async () => {
    if (contractConfig && contractConfig.addresses.token && contractConfig.addresses.deposit) {
      const data = generateDepositData(deposits);
      console.log(data);
      writeDepositContract({
        address: contractConfig.addresses.deposit,
        abi: DEPOSIT_ABI,
        functionName: "batchDeposit",
        args: [
          data.pubkeys,
          data.withdrawal_credentials,
          data.signatures,
          data.deposit_data_roots,
          data.amounts,
        ],
      });

      // should move refetchBalance to onDeposit function ?
      refetchBalance();
    }
  }, [contractConfig, deposits, refetchBalance, writeDepositContract]);

  const approve = useCallback(async (amount: bigint) => {
    if (contractConfig && contractConfig.addresses.token && contractConfig.addresses.deposit) {
      writeApproveContract({
        address: contractConfig.addresses.token,
        abi: ERC677ABI,
        functionName: "approve",
        args: [contractConfig.addresses.deposit, amount],
      });
    }
  }, [contractConfig, writeApproveContract]);

  useEffect(() => {
    if (approveSuccess) {
      setIsApproved(true);
    }
  }, [approveSuccess]);

  useEffect(() => {
    if (depositSuccess) {
      refetchBalance();
    }
  }, [depositSuccess, refetchBalance]);

  const resetDepositState = useCallback(() => {
    setDeposits([]);
    setTotalDepositAmount(0n);
    setIsApproved(false);
  }, []);

  return {
    deposit,
    depositSuccess,
    contractError: depositContractError || approveContractError,
    txError: depositTxError || approveTxError,
    depositHash,
    approveHash,
    depositData: { deposits, totalDepositAmount },
    setDepositData,
    approve,
    isApproved,
    approveSuccess,
    resetDepositState,
  };
}

export default useDeposit;
