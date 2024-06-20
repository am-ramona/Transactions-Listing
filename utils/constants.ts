import { Network } from "alchemy-sdk";
import { AlchemyMultichainClient } from "@/utils/alchemy-multichain-client";

export const defaultConfig = {
    apiKey: process.env.ETH_NETWORK_API_KEY,
    network: Network.ETH_MAINNET,
};

export const overrides = {
    [Network.MATIC_MAINNET]: { apiKey: process.env.MATIC_NETWORK_API_KEY },
};

export const alchemy = new AlchemyMultichainClient(defaultConfig, overrides);