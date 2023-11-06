import Header from "../shared/header/header.view";
import useStyles from "./withdrawal-claim.styles";
import useClaimBalance from "../../hooks/use-claim-balance";
import { formatUnits } from "ethers/lib/utils";
import useDepositContract from "../../hooks/use-deposit-contract";
import { useState } from "react";

function WithdrawalClaim({ network, wallet, onDisconnectWallet, tokenInfo }) {
  const classes = useStyles();
  const claimBalance = useClaimBalance(network.addresses.deposit, wallet);
  const contract = useDepositContract(network.addresses.deposit, wallet);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const onClaim = async () => {
    setLoading(true);
    setError("");

    try {
      await contract.claimWithdrawal(wallet.address);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={classes.container}>
      <Header
        address={wallet.address}
        title="Gnosis Withdrawal Claims"
        onDisconnectWallet={onDisconnectWallet}
        tokenInfo={tokenInfo}
        network={network}
      />

      <div style={{ marginTop: "64px" }}>
        Claimable balance:{" "}
        {Number(formatUnits(claimBalance, tokenInfo.decimals))}{" "}
        {tokenInfo.symbol}
      </div>
      <button
        className={classes.claimButton}
        onClick={onClaim}
        disabled={loading}
      >
        Claim
      </button>
      {error}
    </div>
  );
}

export default WithdrawalClaim;
