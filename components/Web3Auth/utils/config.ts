import { CHAIN_NAMESPACES } from '@web3auth/base'
import { Web3AuthOptions } from '@web3auth/modal'

// Default Web3Auth config for Polygon Mumbai testnet
export const getDefaultWeb3AuthConfig = (clientId: string): Web3AuthOptions => {
  return {
    clientId,
    chainConfig: {
      chainNamespace: CHAIN_NAMESPACES.EIP155,
      rpcTarget: 'https://rpc.ankr.com/polygon_mumbai',
      blockExplorer: 'https://polygonscan.com/',
      chainId: '0x13881',
      displayName: 'Mumbai testnet',
      ticker: 'AVAX',
      tickerName: 'AVAX'
    },
    uiConfig: {
      theme: 'dark',
      loginMethodsOrder: ['github', 'google', 'facebook']
    }
  }
}
