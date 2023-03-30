import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { Network } from 'alchemy-sdk'
import { AlchemyMultichainClient } from '../../../alchemy-multichain-client'
import styles from '@/styles/Home.module.css'

const defaultConfig = {
    apiKey: "oC6F3KjezCjGO5b-S0Wn4uunajlNUB6A",
    network: Network.ETH_MAINNET,
};
const overrides = {
    [Network.MATIC_MAINNET]: { apiKey: 'vXOn8o6kX_znYRMaB3lf2i7srDCZsxVH' },
  };

  const alchemy = new AlchemyMultichainClient(defaultConfig, overrides);

export default function TransactionDetails() {
    const router = useRouter()
    const transaction = router.query.transaction as string
    const amount = router.query.amount as string
    const timestamp = router.query.timestamp as string
    const block_explorer = router.query.block_explorer as string

    const [ receipt, setReceipt ] = useState<any>()

    useEffect(() => {
        getTransactionReceipt(transaction).catch(console.error);
    }, [transaction]);


    async function getTransactionReceipt(hash: any) {
        if (typeof hash === 'undefined') return;

        const network = block_explorer === 'Etherscan' ? Network.ETH_MAINNET:Network.MATIC_MAINNET
        const response = await alchemy.forNetwork(network).core
            .getTransactionReceipt(
                hash // Transaction hash of the transaction for which you want to get information.
            )
          .then((response) => {
            setReceipt(response);
        })
    }

    return (
        <section className={styles.padding}>
            <code className={styles.center}>Transaction details</code>
            <span>
                <a href={block_explorer === 'Etherscan' ? 'https://etherscan.io/': 'https://polygonscan.com/'} target="_blank" className={`${styles.underline} ${styles.wrap}`}>{transaction}</a>
            </span>
            <p> Amount: {amount}</p>
            <p> Timestamp: {timestamp}</p>
            <p> Status: { receipt && receipt.status === 1 ? 'Success' : (receipt && receipt.status === 0) ? 'Failure' : 'Loading' } </p>
            <p> Transaction fee: { receipt && receipt.effectiveGasPrice._hex }</p>
        </section>
    )
}