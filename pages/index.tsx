import Head from "next/head";
import Link from "next/link";

let ethereumAddress = process.env.ETHEREUM_ADDRESS as string;
let polygonAddress = process.env.POLYGON_ADDRESS as string;

export default function Home() {
  return (
    <>
      <Head>
        <title>Ethereum & Polygon Transactions&apos; Listing</title>
        <meta name="description" content="Assessment" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>
      <main className="grid items-center justify-center min-h-screen">
        <code className="font-mono font-medium block">
          <Link
            className="hover:text-green"
            href={{
              pathname: `transactions/${ethereumAddress}`,
              query: { block_explorer: "Etherscan" },
            }}
          >
            Ethereum
          </Link>{" "}
          &&nbsp;
          <Link
            className="hover:text-green"
            href={{
              pathname: `transactions/${polygonAddress}`,
              query: { block_explorer: "Polygonscan" },
            }}
          >
            Polygon
          </Link>
          &nbsp;Blockchains
        </code>
      </main>
    </>
  );
}
