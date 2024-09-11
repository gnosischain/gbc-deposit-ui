import { useCallback, useEffect, useState } from "react";
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import CONTRACTS, { ContractNetwork } from "@/utils/contracts";
import claimRegistryABI from "@/utils/abis/claimRegistry";
import { getPublicClient } from "wagmi/actions";
import { config } from "@/wagmi";
import { fetchRegister, fetchUnregister } from "@/utils/fetchEvents";
import { parseUnits } from "viem";

function useAutoclaim(contractConfig: ContractNetwork | undefined, address: `0x${string}` | undefined, chainId: number) {
  const [isRegister, setIsRegister] = useState(false);
  const client = getPublicClient(config, { chainId: chainId as 100 | 10200 | 31337 });
  const { data: autoclaimHash, writeContract } = useWriteContract();
  const { isSuccess: autoclaimSuccess } = useWaitForTransactionReceipt({
    hash: autoclaimHash,
  });

  useEffect(() => {
    async function fetchEvents() {
      if (contractConfig && address && address !== "0x0") {
        const registerEvents = await fetchRegister(contractConfig.addresses.claimRegistry, address, contractConfig.claimRegistryStartBlockNumber, client);
        const unregisterEvents = await fetchUnregister(contractConfig.addresses.claimRegistry, address, contractConfig.claimRegistryStartBlockNumber, client);

        if (registerEvents.length == 0 && unregisterEvents.length == 0) {
          setIsRegister(false);
        } else if (registerEvents && unregisterEvents.length == 0) {
          setIsRegister(true);
        } else {
          const lastRegisterEvent = registerEvents[registerEvents.length - 1].blockNumber;
          const lastUnregisterEvent = unregisterEvents[unregisterEvents.length - 1].blockNumber;

          if (lastRegisterEvent > lastUnregisterEvent) {
            setIsRegister(true);
          } else {
            setIsRegister(false);
          }
        }
      }
    }

    fetchEvents();
  }, [address, contractConfig]);

  const register = useCallback(
    async (days: number, amount: number) => {
      if (contractConfig) {
        const timeStamp = BigInt(days * 86400);
        writeContract({ address: contractConfig.addresses.claimRegistry, abi: claimRegistryABI, functionName: "register", args: [address || "0x0", timeStamp, parseUnits(amount.toString(), 18)] });
      }
    },
    [address]
  );

  const updateConfig = useCallback(
    async (days: number, amount: number) => {
      if (contractConfig) {
        const timeStamp = BigInt(days * 86400);
        writeContract({ address: contractConfig.addresses.claimRegistry, abi: claimRegistryABI, functionName: "updateConfig", args: [address || "0x0", timeStamp, parseUnits(amount.toString(), 18)] });
      }
    },
    [address]
  );

  const unregister = useCallback(async () => {
    if (contractConfig) {
      writeContract({ address: contractConfig.addresses.claimRegistry, abi: claimRegistryABI, functionName: "unregister", args: [address || "0x0"] });
    }
  }, [address]);

  return { register, updateConfig, unregister, isRegister, autoclaimSuccess, autoclaimHash };
}

export default useAutoclaim;
