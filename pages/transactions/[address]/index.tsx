import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { Network, AssetTransfersCategory } from "alchemy-sdk";
import { AlchemyMultichainClient } from "../../../alchemy-multichain-client";
// import { Roboto_Mono } from 'next/font/google';

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
    <section className="grid grid-areas-frameMobile sm:grid-areas-frame grid-cols-[50%] 2xl:grid-cols-[1000px] gap-4">
      <code className="font-mono font-medium block flex justify-center items-center relative p-centerMobile sm:p-center grid-in-a text-[3vw] sm:text-base">From: {address}</code>
      <code className="font-mono font-medium block italic grid-in-b text-[3vw] sm:text-sm">
        Transactions operated on{" "}
        {block_explorer === "Etherscan" ? "Ethereum" : "Polygon"},
        <span className="text-green">limited to 100:</span>
      </code>

      <main className="ml-0 sm:ml-[14px] p-card rounded-xl bg-[#64646400] border border-solid border-gray grid-in-c transition duration-200 hover:bg-[#6464641a] hover:border-[#c8c8c826] group">
        <div className="grid grid-cols-gridCard max-w-full md:grid-cols-[repeat(2, 50%)] *:sm:text-sm *:text-[3vw] *:inline-block *:transition *:transform *:motion-reduce:hover:transform-none *:group-hover:translate-x-1">
          <span> Amount </span>
          <span> Timestamp </span>
          <span></span>
        </div>

        <div>
          {address && data &&
            data.transfers &&
            data.transfers.length !== 0 &&
            data.transfers.map((item, index) => (
              <div key={index} className="grid grid-cols-gridCard md:grid-cols-[repeat(2, 50%)] max-w-full *:text-[3vw] *:sm:text-sm *:inline-block *:transition *:transform *:motion-reduce:hover:transform-none *:group-hover:translate-x-1 *:break-words">
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
                  className="hover:text-green text-[3vw] sm:text-sm inline-block transition transform motion-reduce:hover:transform-none"
                >
                  see more
                </Link>
              </div>
            ))}
        </div>
      </main>

      <main className="grid-in-d *:text-xs/[5px] *:m-[7px] *:sm:text-sm *:sm:pl-0">
        <span>
          Address current balance is:
          <p className="ml-[7px]">{balance.tokenBalances && balance.tokenBalances[0].tokenBalance}</p>
        </span>
        <p>
          Sort by
          <span
            className="text-red hover:text-[#ec6868] cursor-pointer"
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