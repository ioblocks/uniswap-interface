import { renderHook, act } from '@testing-library/react'
import type { PropsWithChildren } from 'react'
import { SmartPoolContextProvider } from 'state/smartPool/SmartPoolContext'
import {
  useActiveSmartPool,
  useIsSmartPoolEnabled,
  useSmartPoolContext,
  useSmartPoolTransactionWrapper,
} from 'state/smartPool/useSmartPoolContext'
import type { ValidatedTransactionRequest } from 'uniswap/src/features/transactions/types/transactionRequests'

const MOCK_SMART_POOL_ADDRESS = '0x1234567890123456789012345678901234567890' as Address
const MOCK_UNISWAP_ROUTER_ADDRESS = '0xabcdefabcdefabcdefabcdefabcdefabcdefabcd' as Address

const createWrapper =
  (props?: { initialSmartPoolAddress?: Address; initialIsSmartPoolActive?: boolean }) =>
  ({ children }: PropsWithChildren) => (
    <SmartPoolContextProvider {...props}>{children}</SmartPoolContextProvider>
  )

describe('SmartPool hooks', () => {
  describe('useSmartPoolContext', () => {
    it('returns default values when no initial props are provided', () => {
      const { result } = renderHook(() => useSmartPoolContext(), { wrapper: createWrapper() })

      expect(result.current.smartPoolAddress).toBeUndefined()
      expect(result.current.isSmartPoolActive).toBe(false)
    })

    it('returns initial values when props are provided', () => {
      const { result } = renderHook(() => useSmartPoolContext(), {
        wrapper: createWrapper({
          initialSmartPoolAddress: MOCK_SMART_POOL_ADDRESS,
          initialIsSmartPoolActive: true,
        }),
      })

      expect(result.current.smartPoolAddress).toBe(MOCK_SMART_POOL_ADDRESS)
      expect(result.current.isSmartPoolActive).toBe(true)
    })

    it('allows updating smart pool address', () => {
      const { result } = renderHook(() => useSmartPoolContext(), { wrapper: createWrapper() })

      act(() => {
        result.current.setSmartPoolAddress(MOCK_SMART_POOL_ADDRESS)
      })

      expect(result.current.smartPoolAddress).toBe(MOCK_SMART_POOL_ADDRESS)
    })

    it('allows toggling smart pool active state', () => {
      const { result } = renderHook(() => useSmartPoolContext(), {
        wrapper: createWrapper({ initialSmartPoolAddress: MOCK_SMART_POOL_ADDRESS }),
      })

      expect(result.current.isSmartPoolActive).toBe(false)

      act(() => {
        result.current.setIsSmartPoolActive(true)
      })

      expect(result.current.isSmartPoolActive).toBe(true)
    })
  })

  describe('useActiveSmartPool', () => {
    it('returns undefined when smart pool is not active', () => {
      const { result } = renderHook(() => useActiveSmartPool(), {
        wrapper: createWrapper({ initialSmartPoolAddress: MOCK_SMART_POOL_ADDRESS, initialIsSmartPoolActive: false }),
      })

      expect(result.current).toBeUndefined()
    })

    it('returns the smart pool address when active', () => {
      const { result } = renderHook(() => useActiveSmartPool(), {
        wrapper: createWrapper({ initialSmartPoolAddress: MOCK_SMART_POOL_ADDRESS, initialIsSmartPoolActive: true }),
      })

      expect(result.current).toBe(MOCK_SMART_POOL_ADDRESS)
    })

    it('returns undefined when active but no address is set', () => {
      const { result } = renderHook(() => useActiveSmartPool(), {
        wrapper: createWrapper({ initialIsSmartPoolActive: true }),
      })

      expect(result.current).toBeUndefined()
    })
  })

  describe('useIsSmartPoolEnabled', () => {
    it('returns false when smart pool is not active', () => {
      const { result } = renderHook(() => useIsSmartPoolEnabled(), {
        wrapper: createWrapper({ initialSmartPoolAddress: MOCK_SMART_POOL_ADDRESS, initialIsSmartPoolActive: false }),
      })

      expect(result.current).toBe(false)
    })

    it('returns true when smart pool is active and has an address', () => {
      const { result } = renderHook(() => useIsSmartPoolEnabled(), {
        wrapper: createWrapper({ initialSmartPoolAddress: MOCK_SMART_POOL_ADDRESS, initialIsSmartPoolActive: true }),
      })

      expect(result.current).toBe(true)
    })

    it('returns false when active but no address is set', () => {
      const { result } = renderHook(() => useIsSmartPoolEnabled(), {
        wrapper: createWrapper({ initialIsSmartPoolActive: true }),
      })

      expect(result.current).toBe(false)
    })
  })

  describe('useSmartPoolTransactionWrapper', () => {
    const mockTxRequest: ValidatedTransactionRequest = {
      to: MOCK_UNISWAP_ROUTER_ADDRESS,
      data: '0x1234',
      value: '0',
      chainId: 1,
    }

    it('returns original transaction when smart pool is not active', () => {
      const { result } = renderHook(() => useSmartPoolTransactionWrapper(), {
        wrapper: createWrapper({ initialSmartPoolAddress: MOCK_SMART_POOL_ADDRESS, initialIsSmartPoolActive: false }),
      })

      const wrappedTx = result.current(mockTxRequest)
      expect(wrappedTx.to).toBe(MOCK_UNISWAP_ROUTER_ADDRESS)
      expect(wrappedTx.originalTo).toBeUndefined()
    })

    it('redirects transaction to smart pool when active', () => {
      const { result } = renderHook(() => useSmartPoolTransactionWrapper(), {
        wrapper: createWrapper({ initialSmartPoolAddress: MOCK_SMART_POOL_ADDRESS, initialIsSmartPoolActive: true }),
      })

      const wrappedTx = result.current(mockTxRequest)
      expect(wrappedTx.to).toBe(MOCK_SMART_POOL_ADDRESS)
      expect(wrappedTx.originalTo).toBe(MOCK_UNISWAP_ROUTER_ADDRESS)
    })

    it('preserves other transaction fields', () => {
      const { result } = renderHook(() => useSmartPoolTransactionWrapper(), {
        wrapper: createWrapper({ initialSmartPoolAddress: MOCK_SMART_POOL_ADDRESS, initialIsSmartPoolActive: true }),
      })

      const wrappedTx = result.current(mockTxRequest)
      expect(wrappedTx.data).toBe(mockTxRequest.data)
      expect(wrappedTx.value).toBe(mockTxRequest.value)
      expect(wrappedTx.chainId).toBe(mockTxRequest.chainId)
    })
  })
})
