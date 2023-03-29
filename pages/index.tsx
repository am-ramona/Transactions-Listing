import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import { Inter } from 'next/font/google'
import styles from '@/styles/Home.module.css'

const inter = Inter({ subsets: ['latin'] })

let ethereumAddress = '0xAdC00e52a498BE9F4D4BAdcfe5F0218696B9A432'
let polygonAddress = '0x4062B6B17197F213eb88Cf2864734639D928CaF6' 

export default function Home() {
  return (
    <>
      <Head>
        <title>Biconomy Assessment</title>
        <meta name="description" content="Assessment" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>
      <main className={styles.main}>
          <code>  
            <Link href={{ pathname:`transactions/${ethereumAddress}`, query : {block_explorer: 'Etherscan'} }}> 
                            Ethereum
            </Link> &&nbsp;
            <Link href={{ pathname : `transactions/${polygonAddress}`, query : {block_explorer: 'Polygonscan'}}}> 
                            Polygon
            </Link> 
             &nbsp;Blockchains
          </code>
      </main>
    </>
  )
}
