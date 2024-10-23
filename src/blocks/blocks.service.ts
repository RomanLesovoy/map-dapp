import { Injectable } from '@nestjs/common';
import { BlockchainService } from '../blockchain/blockchain.service';

@Injectable()
export class BlocksService {
  constructor(private blockchainService: BlockchainService) {}

  async getBlockOwner(blockId: number): Promise<string> {
    return await this.blockchainService.getBlockOwner(blockId);
  }

  async buyBlock(blockId: number, buyer: string): Promise<boolean> {
    return await this.blockchainService.buyBlock(blockId, buyer);
  }

  async sellBlock(blockId: number, seller: string, price: string): Promise<boolean> {
    return await this.blockchainService.sellBlock(blockId, seller, price);
  }

  async changeBlockColor(blockId: number, color: 'black' | 'white', owner: string): Promise<boolean> {
    return await this.blockchainService.changeBlockColor(blockId, color, owner);
  }

  async getBlockColor(blockId: number): Promise<string> {
    return await this.blockchainService.getBlockColor(blockId);
  }
}
