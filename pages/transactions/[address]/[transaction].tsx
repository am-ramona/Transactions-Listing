/// <reference types="../../../types/global" />
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { Network } from "alchemy-sdk";
import  { alchemy } from "@/utils/constants";

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
        <section className="p-01Mobile sm:p-01">
            <code className="font-mono block font-medium flex justify-center items-center relative p-centerMobile text-[4vw] smallTablet:text-base sm:p-center">
                Transaction details
            </code>
            <span className="*:sm:text-sm *:text-[2.5vw]">
                <span>
                    <a
                        href={
                            block_explorer === "Etherscan"
                                ? "https://etherscan.io/"
                                : "https://polygonscan.com/"
                        }
                        target="_blank"
                        className="underline hover:text-green"
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
