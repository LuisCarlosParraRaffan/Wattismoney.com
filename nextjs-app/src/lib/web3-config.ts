export interface SupportedChain {
    chainId: number;
    hexChainId: string;
    name: string;
    shortName: string;
    nativeCurrency: {
        name: string;
        symbol: string;
        decimals: number;
    };
    rpcUrl: string;
    explorerUrl: string;
    badgeColor: string;
    tokens: {
        USDC: string;
        USDT: string;
    };
}

export const SUPPORTED_EVM_CHAINS: SupportedChain[] = [
    {
        chainId: 137,
        hexChainId: '0x89',
        name: 'Polygon POS',
        shortName: 'Polygon',
        nativeCurrency: { name: 'POL', symbol: 'POL', decimals: 18 },
        rpcUrl: process.env.POLYGON_RPC_URL || 'https://polygon-rpc.com',
        explorerUrl: 'https://polygonscan.com',
        badgeColor: 'bg-purple-100 text-purple-800 border-purple-200',
        tokens: {
            USDC: '0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359',
            USDT: '0xc2132D05D31c914a87C6611C10748AEb04B58e8F',
        },
    },
    {
        chainId: 8453,
        hexChainId: '0x2105',
        name: 'Base Mainnet',
        shortName: 'Base',
        nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
        rpcUrl: process.env.BASE_RPC_URL || 'https://mainnet.base.org',
        explorerUrl: 'https://basescan.org',
        badgeColor: 'bg-blue-100 text-blue-800 border-blue-200',
        tokens: {
            USDC: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913',
            USDT: '0xfde4C96c8593536E31F229EA8f37b2ADa2699bb2',
        },
    },
    {
        chainId: 42161,
        hexChainId: '0xa4b1',
        name: 'Arbitrum One',
        shortName: 'Arbitrum',
        nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
        rpcUrl: process.env.ARBITRUM_RPC_URL || 'https://arb1.arbitrum.io/rpc',
        explorerUrl: 'https://arbiscan.io',
        badgeColor: 'bg-sky-100 text-sky-800 border-sky-200',
        tokens: {
            USDC: '0xaf88d065e77c8cC2239327C5EDb3A432268e5831',
            USDT: '0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9',
        },
    },
    {
        chainId: 1,
        hexChainId: '0x1',
        name: 'Ethereum Mainnet',
        shortName: 'Ethereum',
        nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
        rpcUrl: process.env.ETHEREUM_RPC_URL || 'https://eth.llamarpc.com',
        explorerUrl: 'https://etherscan.io',
        badgeColor: 'bg-slate-100 text-slate-800 border-slate-200',
        tokens: {
            USDC: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
            USDT: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
        },
    },
];

export const TREASURY_EVM_WALLET =
    process.env.NEXT_PUBLIC_TREASURY_EVM_WALLET ||
    '0x71C95911E9a5D330f4D621842EC243EE1343292e';

export const TREASURY_BANK_DETAILS = {
    bankName: process.env.NEXT_PUBLIC_TREASURY_BANK_NAME || 'Bancolombia / Mercury Bank USD',
    accountNumber: process.env.NEXT_PUBLIC_TREASURY_BANK_ACCOUNT || '912-0048291-01 (COP/USD) • SWIFT: COLOCOBM',
    beneficiary: process.env.NEXT_PUBLIC_TREASURY_BENEFICIARY || 'Wattismoney Energy SPV S.A.S.',
    nit: '901.842.119-4',
};

/**
 * Codifica una llamada ERC-20 `transfer(address to, uint256 amount)` (6 decimales para USDC/USDT)
 * sin dependencias externas pesadas para invocarse directamente en `window.ethereum.request`.
 */
export function encodeErc20Transfer(toAddress: string, amountUsd: number, decimals = 6): string {
    const methodId = '0xa9059cbb'; // transfer(address,uint256)
    const cleanAddress = toAddress.toLowerCase().replace(/^0x/, '').padStart(64, '0');
    const rawUnits = BigInt(Math.round(amountUsd * Math.pow(10, decimals)));
    const hexAmount = rawUnits.toString(16).padStart(64, '0');
    return `${methodId}${cleanAddress}${hexAmount}`;
}

export function getChainById(chainId: number): SupportedChain {
    return SUPPORTED_EVM_CHAINS.find((c) => c.chainId === chainId) || SUPPORTED_EVM_CHAINS[0];
}
