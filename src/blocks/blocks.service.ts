import { Injectable } from '@nestjs/common';
import { BlockchainService, BlockInfo } from '../blockchain/blockchain.service';

@Injectable()
export class BlocksService {
  constructor(private blockchainService: BlockchainService) {}

  async buyBlock(blockId: number, buyer: string): Promise<boolean> {
    return await this.blockchainService.buyBlock(blockId, buyer);
  }

  async sellBlock(blockId: number, seller: string, price: string): Promise<boolean> {
    return await this.blockchainService.sellBlock(blockId, seller, price);
  }

  async buyFromUser(blockId: number, buyer: string): Promise<boolean> {
    return await this.blockchainService.buyFromUser(blockId, buyer);
  }

  async setBlockColor(blockId: number, color: number, owner: string): Promise<boolean> {
    return await this.blockchainService.setBlockColor(blockId, color, owner);
  }

  async getBlockInfo(blockId: number): Promise<BlockInfo> {
    return await this.blockchainService.getBlockInfo(blockId);
  }

  async buyMultipleBlocks(blockIds: number[], buyer: string): Promise<boolean> {
    return await this.blockchainService.buyMultipleBlocks(blockIds, buyer);
  }

  async getAllBlocksInfo(startId: number, endId: number): Promise<BlockInfo[]> {
    return await this.blockchainService.getAllBlocksInfo(startId, endId);
  }
}
