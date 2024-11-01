import { ethers } from 'ethers';

export function formatPrice(priceWei: ethers.BigNumberish): string {
  const priceEth = ethers.formatEther(priceWei);
  return `${parseFloat(priceEth).toFixed(4)}`;
}

export function parseBlockId(blockAddress: string): number {
  return parseInt(blockAddress, 16);
}

export function formatAddress(address: string): string {
  if (address === '0x0000000000000000000000000000000000000000') {
    return '0';
  }
  return ethers.getAddress(address);
}
