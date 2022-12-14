import { ADAPTER_STATUS, CustomChainConfig } from '@web3auth/base'
import Head from 'next/head'
import Image from 'next/image'
import { useState } from 'react'
import Select from 'react-select'
// @ts-ignore
import { useWeb3auth } from 'web3auth-react'

import networks from '../config/networks'
import styles from '../styles/Home.module.css'

type optionType = {
  value: string
  label: string
  chainConfig: CustomChainConfig
}

const options: optionType[] = networks.map((network) => ({
  value: network.chainId,
  label: network.displayName,
  chainConfig: network
}))

export const Home = () => {
  const [selectedOption, setSelectedOption] = useState(options[0])
  const { account, balance, chainId, status, userInfo, activate, deactivate, changeNetwork } =
    useWeb3auth()

  const handleChange = (selectedOption: optionType) => {
    setSelectedOption(selectedOption)
    changeNetwork({ chainConfig: selectedOption.chainConfig })
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>Web3Auth Example</title>
        <meta name="description" content="Web3Auth" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <nav className={styles.nav}>
        <div className={styles.navItem}>
          <Image
            src="https://thinkanddev.com/wp-content/uploads/2020/10/think_dev_mobile.png"
            alt="logo"
            width={120}
            height={60}
          />
        </div>
        <div className={styles.navItem}>
          <Select
            isDisabled={status !== ADAPTER_STATUS.CONNECTED}
            className={styles.select}
            value={selectedOption}
            onChange={(opt) => handleChange(opt as optionType)}
            options={options}
          />
          {status === ADAPTER_STATUS.CONNECTED ? (
            <button className={styles.button} onClick={deactivate}>
              Logout
            </button>
          ) : (
            <button className={styles.button} onClick={activate}>
              Login
            </button>
          )}
        </div>
      </nav>
      <main className={styles.main}>
        {status === ADAPTER_STATUS.CONNECTED ? (
          <>
            <div className={styles.card}>
              <h3>ChainId</h3>
              <p>{chainId}</p>
            </div>
            <div className={styles.card}>
              <h3>Accounts</h3>
              <div>{account}</div>
            </div>
            <div className={styles.card}>
              <h3>Balance</h3>
              <p>{balance}</p>
            </div>
            {userInfo?.name && (
              <div className={styles.card}>
                <h3>User Info</h3>
                <div>
                  <Image src={userInfo.profileImage} alt="avatar" width={50} height={50} />
                  <p>Name: {userInfo.name}</p>
                  <p>Email: {userInfo.email}</p>
                  <p>Type of login: {userInfo.typeOfLogin}</p>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className={styles.card}>
            <h3>Connect your wallet</h3>
          </div>
        )}
      </main>

      <footer className={styles.footer}>
        <a href="" target="_blank" rel="noopener noreferrer">
          Think&Dev 2022
        </a>
      </footer>
    </div>
  )
}

export default Home
