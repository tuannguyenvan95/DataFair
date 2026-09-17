import { createClient } from 'genlayer-js';
import { studionet } from 'genlayer-js/chains';

// Network parameters for GenLayer Studio Network (studionet)
export const STUDIONET_CONFIG = {
  chainId: studionet.id, // 61999
  chainIdHex: '0x' + studionet.id.toString(16), // 0xF1EF
  chainName: 'GenLayer Studio Network',
  nativeCurrency: {
    name: 'GEN Token',
    symbol: 'GEN',
    decimals: 18,
  },
  rpcUrls: ['https://studio.genlayer.com/api'],
  blockExplorerUrls: ['https://genlayer-explorer.vercel.app'],
};

// Deployed contract address on GenLayer studionet (Chain 61999)
export const CONTRACT_ADDRESS = (import.meta.env.VITE_CONTRACT_ADDRESS || '0x00A7e5110E97bF301Ec58B919af85Ab82C3599cB') as `0x${string}`;

/**
 * Creates a read-only or signer-attached GenLayer client
 */
export function getGenLayerClient(accountAddress?: `0x${string}`) {
  if (accountAddress) {
    return createClient({
      chain: studionet,
      account: accountAddress,
    });
  }
  return createClient({
    chain: studionet,
  });
}

/**
 * Switch MetaMask to GenLayer Studionet (Rule R23)
 */
export async function switchToStudionet(): Promise<void> {
  if (!window.ethereum) {
    throw new Error('MetaMask is not installed. Please install MetaMask to interact with DataFair.');
  }

  try {
    await window.ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: STUDIONET_CONFIG.chainIdHex }],
    });
  } catch (switchError: any) {
    // Chain not added to MetaMask yet
    if (switchError.code === 4902 || switchError.code === -32603) {
      await window.ethereum.request({
        method: 'wallet_addEthereumChain',
        params: [{
          chainId: STUDIONET_CONFIG.chainIdHex,
          chainName: STUDIONET_CONFIG.chainName,
          nativeCurrency: STUDIONET_CONFIG.nativeCurrency,
          rpcUrls: STUDIONET_CONFIG.rpcUrls,
          blockExplorerUrls: STUDIONET_CONFIG.blockExplorerUrls,
        }],
      });
    } else {
      throw switchError;
    }
  }
}
