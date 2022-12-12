import { CustomChainConfig } from '@web3auth/base'

export const networks: CustomChainConfig[] = [
  {
    displayName: 'Mumbai testnet',
    chainNamespace: 'eip155',
    rpcTarget: 'https://rpc.ankr.com/polygon_mumbai',
    blockExplorer: 'https://polygonscan.com/',
    chainId: '0x13881',
    ticker: 'AVAX',
    tickerName: 'AVAX'
  },
  {
    displayName: 'Fuji testnet',
    chainNamespace: 'eip155',
    rpcTarget: 'https://api.avax-test.network/ext/bc/C/rpc',
    blockExplorer: 'https://cchain.explorer.avax-test.network/',
    chainId: '0xa869',
    ticker: 'AVAX',
    tickerName: 'AVAX'
  }
]

export default networks
