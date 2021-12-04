import { splitSignature, Interface } from 'ethers/lib/utils'
import { constants as ethersConstants } from 'ethers'

async function approve (fromTokenContract, wallet, spender) {
  const allowance = await fromTokenContract.allowance(wallet.address, spender.address)
  const amount = ethersConstants.MaxUint256

  if (allowance.lt(amount)) {
    await fromTokenContract.approve(spender.address, amount)
  }
}

async function createPermitSignature (tokenContractInstance, wallet, spenderAddress, nonce, expiry) {
  // The domain
  const domain = {
    name: await tokenContractInstance.name(),
    version: '1',
    chainId: wallet.chainId,
    verifyingContract: tokenContractInstance.address
  }

  // The named list of all type definitions
  const types = {
    Permit: [
			{ name: 'holder', type: 'address' },
			{ name: 'spender', type: 'address' },
			{ name: 'nonce', type: 'uint256' },
			{ name: 'expiry', type: 'uint256' },
			{ name: 'allowed', type: 'bool' },
		],
  }

  // The data to sign
  const values = {
    holder: wallet.address,
    spender: spenderAddress,
    nonce: nonce,
    expiry: expiry,
    allowed: true
  }

  const rawSignature = await wallet.provider.getSigner()._signTypedData(domain, types, values)
  return splitSignature(rawSignature)
}

async function permit (fromTokenContract, wallet, spender) {
  try {
    const nonce = await fromTokenContract.nonces(wallet.address)
    const expiry = ethersConstants.MaxUint256
    const { v, r, s } = await createPermitSignature(fromTokenContract, wallet, spender.address, nonce, expiry)

    const permitABI = [
      'function permit(address,address,uint256,uint256,bool,uint8,bytes32,bytes32)'
    ]
    const permitInterface = new Interface(permitABI)
    const dataPermit = permitInterface.encodeFunctionData('permit', [
      wallet.address,
      spender.address,
      nonce,
      expiry,
      true,
      v,
      r,
      s
    ])
    return dataPermit
  } catch (error) {
    return []
  }
}

export {
  approve,
  permit
}
