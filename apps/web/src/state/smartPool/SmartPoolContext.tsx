import { PropsWithChildren, useMemo, useState } from 'react'
import { SmartPoolContext } from 'state/smartPool/types'

interface SmartPoolContextProviderProps {
  initialSmartPoolAddress?: Address
  initialIsSmartPoolActive?: boolean
}

export function SmartPoolContextProvider({
  children,
  initialSmartPoolAddress,
  initialIsSmartPoolActive = false,
}: PropsWithChildren<SmartPoolContextProviderProps>) {
  const [smartPoolAddress, setSmartPoolAddress] = useState<Address | undefined>(initialSmartPoolAddress)
  const [isSmartPoolActive, setIsSmartPoolActive] = useState<boolean>(initialIsSmartPoolActive)

  const value = useMemo(
    () => ({
      smartPoolAddress,
      isSmartPoolActive,
      setSmartPoolAddress,
      setIsSmartPoolActive,
    }),
    [smartPoolAddress, isSmartPoolActive],
  )

  return <SmartPoolContext.Provider value={value}>{children}</SmartPoolContext.Provider>
}
