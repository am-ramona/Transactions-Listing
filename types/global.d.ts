interface Data {
  transfers: Array<{
    value: number | null;
    hash: string;
    metadata: {
      blockTimestamp: string;
    };
  }>;
  pageKey?: string;
}

interface Balance {
  tokenBalances: Array<{ tokenBalance: string | null }>;
  // [x: string | number | symbol]: unknown
}

interface Receipt {
  status?: number | undefined;
  effectiveGasPrice: {
    _hex: string;
  };
}

declare module "next/app" {
  interface AppProps {
    data: Data;
    balance: Balance;
    receipt: Receipt;
  }
}
