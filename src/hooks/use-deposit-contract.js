import { useEffect, useState } from "react";
import { Contract } from "ethers";

import depositAbi from "../abis/deposit";

function useDepositContract(depositContractAddress, wallet) {
  const [contract, setContract] = useState();

  useEffect(() => {
    if (!depositContractAddress || !wallet) {
      return;
    }

    const contract = new Contract(
      depositContractAddress,
      depositAbi,
      wallet.provider.getSigner()
    );
    setContract(contract);
  }, [depositContractAddress, wallet]);

  return contract;
}

export default useDepositContract;
