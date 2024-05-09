import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { Network } from "alchemy-sdk";
import { AlchemyMultichainClient } from "@/alchemy-multichain-client";

interface Receipt {
    status?: number | undefined;
    effectiveGasPrice: {
        _hex: string;
    };
}

const defaultConfig = {
    apiKey: "oC6F3KjezCjGO5b-S0Wn4uunajlNUB6A",
    network: Network.ETH_MAINNET,
};
const overrides = {
    [Network.MATIC_MAINNET]: { apiKey: "vXOn8o6kX_znYRMaB3lf2i7srDCZsxVH" },
};

const alchemy = new AlchemyMultichainClient(defaultConfig, overrides);

const TransactionDetails: React.FC = () => {
    const router = useRouter();
    const transaction = router.query.transaction as string;
    const amount = router.query.amount as string;
    const timestamp = router.query.timestamp as string;
    const block_explorer = router.query.block_explorer as string;
    const date = new Date(timestamp).toDateString();

    const [receipt, setReceipt] = useState<Receipt | null>();

    useEffect(() => {
        async function getTransactionReceipt(hash: string) {
            if (typeof hash === "undefined") return;

            const network =
                block_explorer === "Etherscan"
                    ? Network.ETH_MAINNET
                    : Network.MATIC_MAINNET;
            const response = await alchemy
                .forNetwork(network)
                .core.getTransactionReceipt(
                    hash // Transaction hash of the transaction for which we want to get information.
                )
                .then((response) => {
                    setReceipt(response);
                });
        }

        getTransactionReceipt(transaction).catch(console.error);
    }, [transaction, block_explorer]);

    return (
        <section className="p-01">
            <code className="font-mono block font-medium flex justify-center items-center relative p-centerMobile text-[4vw] smallTablet:text-base sm:p-center">
                Transaction details
            </code>
            <span className="*:sm:text-sm *:text-[3vw]">
                <span>
                    <a
                        href={
                            block_explorer === "Etherscan"
                                ? "https://etherscan.io/"
                                : "https://polygonscan.com/"
                        }
                        target="_blank"
                        className="underline wrap break-words hover:text-green"
                    >
                        {transaction}
                    </a>
                </span>
                <p> Amount: {amount}</p>
                <p> Timestamp: {date}</p>
                <p>
                    {" "}
                    Status:{" "}
                    {receipt && receipt.status === 1
                        ? "Success"
                        : receipt && receipt.status === 0
                            ? "Failure"
                            : "Loading"}{" "}
                </p>
                <p> Transaction fee: {receipt && receipt.effectiveGasPrice._hex}</p>
            </span>
        </section>
    );
};

export default TransactionDetails;
