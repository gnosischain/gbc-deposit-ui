import { splitSignature, Interface } from 'ethers/lib/utils'
import { constants as ethersConstants } from 'ethers'

async function approve (fromTokenContract, wallet, spender) {
  const allowance = await fromTokenContract.allowance(wallet.address, spender.address)
  const amount = ethersConstants.MaxUint256

  if (allowance.lt(amount)) {
    await fromTokenContract.approve(spender.address, amount)
  }
}

async function createPermitSignature (tokenContractInstance, wallet, spenderAddress, value, nonce, deadline) {
  const chainId = (await tokenContractInstance.getChainId())
  const name = await tokenContractInstance.name()

  // The domain
  const domain = {
    name: name,
    version: '1',
    chainId: chainId,
    verifyingContract: tokenContractInstance.address
  }

  // The named list of all type definitions
  const types = {
    Permit: [
      { name: 'owner', type: 'address' },
      { name: 'spender', type: 'address' },
      { name: 'value', type: 'uint256' },
      { name: 'nonce', type: 'uint256' },
      { name: 'deadline', type: 'uint256' }
    ]
  }

  // The data to sign
  const values = {
    owner: wallet.address,
    spender: spenderAddress,
    value: value,
    nonce: nonce,
    deadline: deadline
  }

  const rawSignature = await wallet.provider.getSigner()._signTypedData(domain, types, values)
  return splitSignature(rawSignature)
}

async function permit (fromTokenContract, wallet, spender) {
  const nonce = await fromTokenContract.nonces(wallet.address)
  const amount = ethersConstants.MaxUint256
  const deadline = ethersConstants.MaxUint256
  const { v, r, s } = await createPermitSignature(fromTokenContract, wallet, spender.address, amount, nonce, deadline)

  const permitABI = [
    'function permit(address,address,uint256,uint256,uint8,bytes32,bytes32)'
  ]
  const permitInterface = new Interface(permitABI)
  const dataPermit = permitInterface.encodeFunctionData('permit', [
    wallet.address,
    spender.address,
    amount,
    deadline,
    v,
    r,
    s
  ])

  return dataPermit
}

export {
  approve,
  permit
}
