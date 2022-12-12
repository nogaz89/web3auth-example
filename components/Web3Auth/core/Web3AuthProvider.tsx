import {
  ADAPTER_EVENTS,
  ADAPTER_STATUS,
  CustomChainConfig,
  SafeEventEmitterProvider,
  UserInfo,
  WALLET_ADAPTERS
} from '@web3auth/base'
import { EthereumPrivateKeyProvider } from '@web3auth/ethereum-provider'
import React, { createContext, useCallback, useContext, useEffect, useState } from 'react'

import { IWeb3AuthContext, useGetLibrary, useWeb3AuthInit, web3AuthProviderProps } from '../index'

const initialState: IWeb3AuthContext = {
  account: null,
  balance: null,
  chainId: null,
  error: null,
  library: null,
  status: ADAPTER_EVENTS.NOT_READY,
  userInfo: undefined,
  web3auth: null,
  activate: () => null,
  deactivate: () => null,
  changeNetwork: () => null
}

const Web3AuthContext = createContext<IWeb3AuthContext>(initialState)

export const useWeb3auth = (): IWeb3AuthContext => {
  return useContext<IWeb3AuthContext>(Web3AuthContext)
}

export const Web3AuthProvider = ({
  clientId,
  config,
  children
}: web3AuthProviderProps): JSX.Element => {
  const [account, setAccount] = useState<string | undefined>(undefined)
  const [balance, setBalance] = useState<string | null>(null)
  const [chainId, setChainId] = useState<number | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [provider, setProvider] = useState<SafeEventEmitterProvider | null>(null)
  const [status, setStatus] = useState<string>(ADAPTER_STATUS.NOT_READY)
  const [userInfo, setUserInfo] = useState<UserInfo | undefined>(undefined)

  // Init web3auth instance
  const { web3auth, error: web3AuthError } = useWeb3AuthInit({ clientId, config })

  // Get library from provider
  const [library] = useGetLibrary({ provider })

  const activate = async () => {
    try {
      if (!web3auth) {
        throw new Error('Web3Auth is not ready')
      }
      await web3auth.connect()
    } catch (e) {
      if (e instanceof Error) setError(e.message)
    }
  }

  const deactivate = useCallback(async () => {
    try {
      if (!web3auth) throw new Error('Web3Auth is not ready')
      await web3auth.logout()
    } catch (e) {
      if (e instanceof Error) setError(e.message)
    }
  }, [web3auth])

  const changeNetwork = async ({ chainConfig }: { chainConfig: CustomChainConfig }) => {
    // Connected with Metamask
    if (provider && web3auth?.connectedAdapterName === WALLET_ADAPTERS.METAMASK) {
      await provider.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: chainConfig.chainId }]
      })
    }

    // Connected with OpenLogin
    if (provider && web3auth?.connectedAdapterName === WALLET_ADAPTERS.OPENLOGIN) {
      const privateKey = await provider.request({
        method: 'eth_private_key'
      })
      const ethereumPrivateKeyProvider = new EthereumPrivateKeyProvider({
        config: { chainConfig }
      })
      await ethereumPrivateKeyProvider.setupProvider(privateKey as string)
      setProvider(ethereumPrivateKeyProvider.provider)
    }
  }

  // Update account, chainId and balance when library changes
  useEffect(() => {
    const update = async () => {
      try {
        if (library) {
          const currentAccount = (await library.eth.getAccounts())[0]
          const currentChainId = await library.eth.getChainId()
          const balance = library.utils.fromWei(await library.eth.getBalance(currentAccount))
          const userInfo = (await web3auth?.getUserInfo()) as UserInfo

          if (currentAccount !== account) setAccount(currentAccount)
          if (currentChainId !== chainId) setChainId(currentChainId)
          setBalance(balance)
          setUserInfo(userInfo)
        } else {
          setAccount(undefined)
          setBalance(null)
          setChainId(null)
          setUserInfo(undefined)
        }
      } catch (e) {
        if (e instanceof Error) setError(e.message)
      }
    }
    update()
  }, [account, chainId, library, web3auth])

  // Set status when web3auth status changes
  useEffect(() => {
    web3auth?.status && setStatus(web3auth?.status)
    if (web3auth?.status === ADAPTER_STATUS.CONNECTED) {
      setProvider(web3auth.provider)
    }
  }, [web3auth?.provider, web3auth?.status])

  // Set error when web3auth has error on init process (e.g. invalid clientId)
  useEffect(() => {
    if (web3AuthError) {
      setError(`web3AuthError - ${web3AuthError}`)
      setProvider(null)
    }
  }, [web3AuthError])

  // If error is set then deactivate web3auth and reset error
  useEffect(() => {
    if (error) {
      deactivate()
      setError(null)
    }
  }, [deactivate, error])

  // Suscribe to web3auth events
  useEffect(() => {
    if (web3auth) {
      web3auth.on(ADAPTER_EVENTS.READY, () => {
        setStatus(ADAPTER_EVENTS.READY)
      })
      web3auth.on(ADAPTER_EVENTS.NOT_READY, () => {
        setStatus(ADAPTER_EVENTS.NOT_READY)
      })
      web3auth.on(ADAPTER_EVENTS.CONNECTING, () => {
        setStatus(ADAPTER_EVENTS.CONNECTING)
      })
      web3auth.on(ADAPTER_EVENTS.CONNECTED, () => {
        setProvider(web3auth.provider)
        setStatus(ADAPTER_EVENTS.CONNECTED)
      })
      web3auth.on(ADAPTER_EVENTS.DISCONNECTED, () => {
        setProvider(null)
        setStatus(ADAPTER_EVENTS.DISCONNECTED)
      })
      web3auth.on(ADAPTER_EVENTS.ERRORED, (error: Error) => {
        setError(error.message)
        setStatus(ADAPTER_EVENTS.ERRORED)
      })
    }
  }, [web3auth])

  // Suscribe to provider events
  useEffect(() => {
    if (provider) {
      provider.on('accountsChanged', (accounts: string[]) => {
        setAccount(accounts[0])
      })
      provider.on('chainChanged', (chainId: number) => {
        const decimalChainId = parseInt(chainId.toString(16), 16)
        setChainId(decimalChainId)
      })
    }
  }, [provider, web3auth])

  return (
    <Web3AuthContext.Provider
      value={{
        account,
        balance,
        chainId,
        error,
        library,
        status,
        userInfo,
        web3auth,
        activate,
        deactivate,
        changeNetwork
      }}
    >
      {children}
    </Web3AuthContext.Provider>
  )
}
