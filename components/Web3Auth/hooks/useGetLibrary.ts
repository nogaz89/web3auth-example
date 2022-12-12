import { SafeEventEmitterProvider } from '@web3auth/base'
import { useEffect, useState } from 'react'
import Web3 from 'web3'
import { provider } from 'web3-core'

import { IWeb3AuthContext } from '../utils/types'

export const useGetLibrary = ({
  provider
}: {
  provider: SafeEventEmitterProvider | null
}): [IWeb3AuthContext['library']] => {
  const [library, setLibrary] = useState<IWeb3AuthContext['library']>(null)

  useEffect(() => {
    provider ? setLibrary(new Web3(provider as provider)) : setLibrary(null)
  }, [provider])

  return [library]
}
