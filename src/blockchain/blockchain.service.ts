import { Injectable } from '@nestjs/common';
import { BaseContract, ethers } from 'ethers';
import * as dotenv from 'dotenv';
import { ApiProperty } from '@nestjs/swagger';
dotenv.config();

export interface Block {
  owner: string;
  color: string;
  price: ethers.BigNumberish;
}

export class BlockInfo {
  @ApiProperty()
  owned: boolean;

  @ApiProperty()
  owner: string;

  @ApiProperty()
  color: number;

  @ApiProperty()
  price: ethers.BigNumberish;
}

interface ContractWithSigner extends BaseContract {
  buyBlock: (blockId: number, options: { value: ethers.BigNumberish }) => Promise<ethers.TransactionResponse>;
  sellBlock: (blockId: number, price: ethers.BigNumberish) => Promise<ethers.TransactionResponse>;
  buyFromUser: (blockId: number, options: { value: ethers.BigNumberish }) => Promise<ethers.TransactionResponse>;
  setColor: (blockId: number, color: number) => Promise<ethers.TransactionResponse>;
  getBlockInfo: (blockId: number) => Promise<BlockInfo>;
  buyMultipleBlocks: (blockIds: number[], options: { value: ethers.BigNumberish }) => Promise<ethers.TransactionResponse>;
  getAllBlocksInfo: (startId: number, endId: number) => Promise<BlockInfo[]>;
}

@Injectable()
export class BlockchainService {
  private provider: ethers.JsonRpcProvider;
  private contract: ethers.Contract;

  constructor() {
    this.provider = new ethers.JsonRpcProvider('http://localhost:8545');
    const contractAddress = process.env.CONTRACT_ADDRESS;
    const abi = [
      "function buyBlock(uint256 blockId) public payable",
      "function sellBlock(uint256 blockId, uint256 price) public",
      "function buyFromUser(uint256 blockId) public payable",
      "function setColor(uint256 blockId, uint8 color) public",
      "function getBlockInfo(uint256 blockId) public view returns (bool owned, address owner, uint8 color, uint256 price)",
      "function buyMultipleBlocks(uint256[] memory blockIds) public payable",
      "function getAllBlocksInfo(uint256 startId, uint256 endId) public view returns (BlockInfo[] memory)"
    ];
    this.contract = new ethers.Contract(contractAddress, abi, this.provider);
  }

  async buyBlock(blockId: number, buyer: string): Promise<boolean> {
    const signer = await this.provider.getSigner(buyer);
    const contractWithSigner = this.contract.connect(signer) as ContractWithSigner;
    const tx = await contractWithSigner.buyBlock(blockId, { value: ethers.parseEther("0.1") });
    await tx.wait();
    return true;
  }

  async sellBlock(blockId: number, seller: string, price: string): Promise<boolean> {
    const signer = await this.provider.getSigner(seller);
    const contractWithSigner = this.contract.connect(signer) as ContractWithSigner;
    const tx = await contractWithSigner.sellBlock(blockId, ethers.parseEther(price));
    await tx.wait();
    return true;
  }

  async buyFromUser(blockId: number, buyer: string): Promise<boolean> {
    const signer = await this.provider.getSigner(buyer);
    const contractWithSigner = this.contract.connect(signer) as ContractWithSigner;
    const blockInfo = await this.contract.getBlockInfo(blockId);
    const tx = await contractWithSigner.buyFromUser(blockId, { value: blockInfo.price });
    await tx.wait();
    return true;
  }

  async setBlockColor(blockId: number, color: number, owner: string): Promise<boolean> {
    const signer = await this.provider.getSigner(owner);
    const contractWithSigner = this.contract.connect(signer) as ContractWithSigner;
    const tx = await contractWithSigner.setColor(blockId, color);
    await tx.wait();
    return true;
  }

  async getBlockInfo(blockId: number): Promise<BlockInfo> {
    return await this.contract.getBlockInfo(blockId);
  }

  async buyMultipleBlocks(blockIds: number[], buyer: string): Promise<boolean> {
    const signer = await this.provider.getSigner(buyer);
    const contractWithSigner = this.contract.connect(signer) as ContractWithSigner;
    const totalCost = ethers.parseEther((0.1 * blockIds.length).toString());
    const tx = await contractWithSigner.buyMultipleBlocks(blockIds, { value: totalCost });
    await tx.wait();
    return true;
  }

  async getAllBlocksInfo(startId: number, endId: number): Promise<BlockInfo[]> {
    return await this.contract.getAllBlocksInfo(startId, endId);
  }
}
