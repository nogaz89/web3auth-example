import '../styles/globals.css'

import type { AppProps } from 'next/app'
// @ts-ignore
import { Web3AuthProvider } from 'web3auth-react'

export default function App({ Component, pageProps }: AppProps) {
  const clientId = process.env.NEXT_PUBLIC_WEB3AUTH_CLIENT_ID || ''

  return (
    <Web3AuthProvider clientId={clientId}>
      <Component {...pageProps} />
    </Web3AuthProvider>
  )
}
