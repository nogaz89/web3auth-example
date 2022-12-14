import '../styles/globals.css'

import type { AppProps } from 'next/app'
import dynamic from 'next/dynamic'
// @ts-ignore
// import { Web3AuthProvider } from 'web3auth-react'

export default function App({ Component, pageProps }: AppProps) {
  const clientId = process.env.NEXT_PUBLIC_WEB3AUTH_CLIENT_ID || ''

  // import Web3AuthProvider from 'web3auth-react' dynamically to avoid SSR errors in Next.js apps
  // @ts-ignore
  const web3Auth = () => dynamic(() => import('web3auth-react'), { ssr: false })
  const { Web3AuthProvider } = web3Auth

  return (
    // @ts-ignore
    <Web3AuthProvider clientId={clientId}>
      <Component {...pageProps} />
      {/* @ts-ignore */}
    </Web3AuthProvider>
  )
}
