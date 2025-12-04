import { createContext, Dispatch, SetStateAction } from 'react'
import type { ValidatedTransactionRequest } from 'uniswap/src/features/transactions/types/transactionRequests'

/**
 * Type for a transaction request that can be optionally redirected to a smart pool.
 * When redirected, the original contract address and data are preserved in the transaction data
 * and the `to` address is changed to the smart pool address.
 */
export type SmartPoolTransactionRequest = ValidatedTransactionRequest & {
  // Original contract address (before smart pool redirection)
  originalTo?: Address
}

export type SmartPoolContextType = {
  // The smart pool address that will receive transactions instead of Uniswap contracts
  smartPoolAddress: Address | undefined
  // Whether the smart pool mode is active
  isSmartPoolActive: boolean
  // Set the smart pool address
  setSmartPoolAddress: Dispatch<SetStateAction<Address | undefined>>
  // Enable/disable smart pool mode
  setIsSmartPoolActive: Dispatch<SetStateAction<boolean>>
}

export const SmartPoolContext = createContext<SmartPoolContextType>({
  smartPoolAddress: undefined,
  isSmartPoolActive: false,
  setSmartPoolAddress: () => undefined,
  setIsSmartPoolActive: () => undefined,
})
