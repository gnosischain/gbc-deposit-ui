import { useEffect, useState } from "react";
import useDepositContract from "./use-deposit-contract";

function useClaimBalance(depositContractAddress, wallet) {
  const contract = useDepositContract(depositContractAddress, wallet);
  const [balance, setBalance] = useState(0n);

  useEffect(() => {
    if (!contract) {
      return;
    }

    contract.withdrawableAmount(wallet.address).then(setBalance);
  }, [contract, wallet.address]);

  return balance;
}

export default useClaimBalance;
