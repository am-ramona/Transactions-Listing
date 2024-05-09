import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { Network, AssetTransfersCategory } from "alchemy-sdk";
import { AlchemyMultichainClient } from "../../../alchemy-multichain-client";
// import { Roboto } from 'next/font/google';
import styles from "@/styles/Home.module.css";

interface Data {
  transfers: Array<{
    value: number | null,
    hash: string,
    metadata: {
      blockTimestamp: string
    }
  }>,
  pageKey?: string
}

interface Balance {
  tokenBalances: Array<{ tokenBalance: string | null }>,
  // [x: string | number | symbol]: unknown
}

// const roboto_mono = Roboto_Mono({
//   subsets: ['latin'],
//   weight: '300',
//   display: 'swap'
// })

const defaultConfig = {
  apiKey: "oC6F3KjezCjGO5b-S0Wn4uunajlNUB6A",
  network: Network.ETH_MAINNET,
};
const overrides = {
  [Network.MATIC_MAINNET]: { apiKey: "vXOn8o6kX_znYRMaB3lf2i7srDCZsxVH" },
};

const alchemy = new AlchemyMultichainClient(defaultConfig, overrides);

//The below token contract address corresponds to USDT
const tokenContractAddresses = ["0xdAC17F958D2ee523a2206206994597C13D831ec7"];

const Transactions: React.FC = () => {
  const router = useRouter();
  const address = router.query.address as string;
  const block_explorer = router.query.block_explorer as string;

  const [data, setData] = useState<Data>();
  const [balance, setBalance] = useState<Balance>({});
  const [order, setOrder] = useState<boolean>(true);

  useEffect(() => {
    getEthereumData(true).catch(console.error);
  }, [address]);

  async function getEthereumData(order: boolean) {
    if (typeof address === "undefined") return;

    const network =
      block_explorer === "Etherscan"
        ? Network.ETH_MAINNET
        : Network.MATIC_MAINNET;

    try {
      const data = await alchemy
        .forNetwork(network)
        .core.getAssetTransfers({
          fromBlock: "0x0",
          fromAddress: address,
          category: [
            AssetTransfersCategory.EXTERNAL,
            AssetTransfersCategory.INTERNAL,
            AssetTransfersCategory.ERC20,
            AssetTransfersCategory.ERC721,
            AssetTransfersCategory.ERC1155,
          ],
          order: order === true ? "asc" : "desc",
          withMetadata: true,
          maxCount: 100,
        })
        .then((data) => {
          setData(data);
          setOrder(order);
        });

      const balance = await alchemy
        .forNetwork(network)
        .core.getTokenBalances(address, tokenContractAddresses)
        .then((balance: Balance) => {
          setBalance(balance);
        });
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <section className={styles.frame}>
      <code className={styles.center}>From: {address}</code>
      <code className={styles.italic}>
        Transactions operated on{" "}
        {block_explorer === "Etherscan" ? "Ethereum" : "Polygon"},
        <span className={styles.green}>limited to 100:</span>
      </code>

      <main className={styles.card}>
        <div className={styles.grid}>
          <span> Amount </span>
          <span> Timestamp </span>
          <span></span>
        </div>

        <div>
          {address && data &&
            data.transfers &&
            data.transfers.length !== 0 &&
            data.transfers.map((item, index) => (
              <div key={index} className={styles.grid}>
                <span>{item.value}</span>
                <span>{item.metadata.blockTimestamp}</span>
                <Link
                  href={{
                    pathname: `${address}/${item.hash}`,
                    query: {
                      amount: item.value,
                      timestamp: item.metadata.blockTimestamp,
                      block_explorer: block_explorer,
                    },
                  }}
                >
                  see more
                </Link>
              </div>
            ))}
        </div>
      </main>

      <main>
        <p>
          Address current balance is: &nbsp;
          {balance.tokenBalances && balance.tokenBalances[0].tokenBalance}
        </p>
        <p>
          Sort by
          <span
            className={`${styles.red} ${styles.pointer}`}
            onClick={() => getEthereumData(!order)}
          >
            &nbsp;Timestamp
          </span>
        </p>
      </main>
    </section>
  );
}

export default Transactions;