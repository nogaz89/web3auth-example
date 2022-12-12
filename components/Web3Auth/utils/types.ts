import { CustomChainConfig, UserInfo, WALLET_ADAPTER_TYPE } from '@web3auth/base'
import { ModalConfig, Web3Auth, Web3AuthOptions } from '@web3auth/modal'
import { ReactNode } from 'react'
import Web3 from 'web3'

export declare const OPENLOGIN_NETWORK: {
  readonly MAINNET: 'mainnet'
  readonly TESTNET: 'testnet'
  readonly CYAN: 'cyan'
}

export interface IWeb3AuthContext {
  account: string | null | undefined
  balance: string | null
  chainId: number | null
  error: string | null
  library: Web3 | null
  status: string
  userInfo: UserInfo | undefined
  web3auth: Web3Auth | null
  activate: () => void
  deactivate: () => void
  // eslint-disable-next-line no-unused-vars
  changeNetwork: ({ chainConfig }: { chainConfig: CustomChainConfig }) => void
}

export type configType = {
  network?: typeof OPENLOGIN_NETWORK[keyof typeof OPENLOGIN_NETWORK]
  modalConfig?: Record<WALLET_ADAPTER_TYPE, ModalConfig>
  web3auth?: Web3AuthOptions
}

export type web3AuthProviderProps = {
  clientId: string
  config?: configType
  children?: ReactNode
}
