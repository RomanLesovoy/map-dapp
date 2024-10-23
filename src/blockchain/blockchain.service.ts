import { Injectable } from '@nestjs/common';
import { BaseContract, ethers } from 'ethers';
import * as dotenv from 'dotenv';
dotenv.config();

interface ContractWithSigner extends BaseContract {
  buyBlock: (blockId: number, options: { value: ethers.BigNumberish }) => Promise<ethers.TransactionResponse>;
  setBlockColor: (blockId: number, color: string) => Promise<ethers.TransactionResponse>;
  getBlockColor: () => Promise<string>;
  ownerOf: (blockId: number) => Promise<string>;
  setBlockPrice: (blockId: number, price: ethers.BigNumberish) => Promise<ethers.TransactionResponse>;
  getBlockPrice: (blockId: number) => Promise<ethers.BigNumberish>;
}

@Injectable()
export class BlockchainService {
  private provider: ethers.JsonRpcProvider;
  private contract: ethers.Contract;

  constructor() {
    // connect to local hardhat node
    this.provider = new ethers.JsonRpcProvider('http://localhost:8545');

    // contract address after deployment
    const contractAddress = process.env.CONTRACT_ADDRESS;

    // contract ABI (change to actual ABI of your contract)
    const abi = [
      "function mint(uint256 blockId) public payable",
      "function setBlockColor(uint256 blockId, string memory color) public",
      "function getBlockColor(uint256 blockId) public view returns (string memory)",
      "function ownerOf(uint256 tokenId) public view returns (address)",
      "function setBlockPrice(uint256 blockId, uint256 price) public",
      "function getBlockPrice(uint256 blockId) public view returns (uint256)",
      "function buyBlock(uint256 blockId) public payable"
    ];

    // create contract instance
    this.contract = new ethers.Contract(contractAddress, abi, this.provider);
  }

  async getBlockOwner(blockId: number): Promise<string> {
    return await this.contract.ownerOf(blockId);
  }

  async buyBlock(blockId: number, buyer: string): Promise<boolean> {
    const signer = await this.provider.getSigner(buyer);
    const contractWithSigner = this.contract.connect(signer) as ContractWithSigner;
    const price = await this.contract.getBlockPrice(blockId);
    const tx = await contractWithSigner.buyBlock(blockId, { value: price });
    await tx.wait();
    return true;
  }

  async sellBlock(blockId: number, seller: string, price: string): Promise<boolean> {
    const signer = await this.provider.getSigner(seller);
    const contractWithSigner = this.contract.connect(signer) as ContractWithSigner;
    const tx = await contractWithSigner.setBlockPrice(blockId, ethers.parseEther(price));
    await tx.wait();
    return true;
  }

  async changeBlockColor(blockId: number, color: 'black' | 'white', owner: string): Promise<boolean> {
    const signer = await this.provider.getSigner(owner);
    const contractWithSigner = this.contract.connect(signer) as ContractWithSigner;
    const tx = await contractWithSigner.setBlockColor(blockId, color);
    await tx.wait();
    return true;
  }

  async getBlockColor(blockId: number): Promise<string> {
    return await this.contract.getBlockColor(blockId);
  }

  async getBlockPrice(blockId: number): Promise<string> {
    const price = await this.contract.getBlockPrice(blockId);
    return ethers.formatEther(price);
  }
}
