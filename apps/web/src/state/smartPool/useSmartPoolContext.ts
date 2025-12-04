import { useCallback, useContext } from 'react'
import { SmartPoolContext, SmartPoolContextType, SmartPoolTransactionRequest } from 'state/smartPool/types'
import type { ValidatedTransactionRequest } from 'uniswap/src/features/transactions/types/transactionRequests'

/**
 * Hook to access the SmartPool context.
 * Returns the smart pool address, active state, and setters.
 */
export function useSmartPoolContext(): SmartPoolContextType {
  return useContext(SmartPoolContext)
}

/**
 * Mock hook that returns the active smart pool address.
 * This hook can be used by components to check if there's an active smart pool
 * that should receive transactions instead of Uniswap contracts.
 *
 * @returns The smart pool address if smart pool mode is active, undefined otherwise
 */
export function useActiveSmartPool(): Address | undefined {
  const { smartPoolAddress, isSmartPoolActive } = useSmartPoolContext()
  return isSmartPoolActive ? smartPoolAddress : undefined
}

/**
 * Hook to check if smart pool mode is enabled and has a valid address.
 * Useful for conditional rendering and logic based on smart pool availability.
 */
export function useIsSmartPoolEnabled(): boolean {
  const smartPoolAddress = useActiveSmartPool()
  return smartPoolAddress !== undefined
}

/**
 * Hook that provides a function to wrap transaction requests for smart pool execution.
 * When a smart pool is active, the transaction's `to` address will be changed to the
 * smart pool address, while preserving the original contract address.
 *
 * @returns A function that takes a transaction request and returns a potentially modified request
 */
export function useSmartPoolTransactionWrapper(): (
  txRequest: ValidatedTransactionRequest,
) => SmartPoolTransactionRequest {
  const smartPoolAddress = useActiveSmartPool()

  return useCallback(
    (txRequest: ValidatedTransactionRequest): SmartPoolTransactionRequest => {
      if (!smartPoolAddress) {
        return txRequest
      }

      // Redirect the transaction to the smart pool
      // The smart pool contract will execute the actual operation
      return {
        ...txRequest,
        originalTo: txRequest.to,
        to: smartPoolAddress,
      }
    },
    [smartPoolAddress],
  )
}
