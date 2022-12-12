import { Web3Auth } from '@web3auth/modal'
import { OpenloginAdapter } from '@web3auth/openlogin-adapter'
import { useEffect, useState } from 'react'

import { configType, getDefaultWeb3AuthConfig } from '../utils'

export const useWeb3AuthInit = ({
  clientId,
  config
}: {
  clientId: string
  config?: configType
}) => {
  const [web3auth, setWeb3auth] = useState<Web3Auth | null>(null)
  const [error, setError] = useState<string | null>(null)

  // Web3Auth initialization
  useEffect(() => {
    const init = async () => {
      try {
        const newWeb3auth = new Web3Auth(
          config?.web3auth ? { ...config?.web3auth, clientId } : getDefaultWeb3AuthConfig(clientId)
        )

        const openloginAdapter = new OpenloginAdapter({
          adapterSettings: {
            clientId,
            network: config?.isMainnet ? 'mainnet' : 'testnet'
          }
        })

        newWeb3auth.configureAdapter(openloginAdapter)

        await newWeb3auth.initModal({
          modalConfig: { ...config?.modalConfig }
        })
        setWeb3auth(newWeb3auth)
      } catch (e) {
        setWeb3auth(null)
        if (e instanceof Error) setError(e.message)
      }
    }

    init()
  }, [clientId, config])

  return { web3auth, error }
}
