// NOTE: Ideally this should use { assert: { type: 'json' } },
// but this would require significant changes in the build process
export async function loadCachedDeposits(network) {
  try {
    const {
      deposits = [],
      lastBlock = network.depositStartBlockNumber,
    } = await import(`../data/${network.chainId}/deposits.json`);
    return { deposits, lastBlock };
  } catch (err) {
    console.error(err);
  }

  return {
    lastBlock: network.depositStartBlockNumber,
    deposits: [],
  };
}
