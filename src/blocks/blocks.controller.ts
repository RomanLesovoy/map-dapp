import { Controller, Get, Post, Param, Body, Query } from '@nestjs/common';
import { BlocksService } from './blocks.service';
import { BlockInfo } from '../blockchain/blockchain.service';

@Controller('blocks')
export class BlocksController {
  constructor(private readonly blocksService: BlocksService) {}

  @Post(':id/buy')
  async buyBlock(@Param('id') id: string, @Body('buyer') buyer: string) {
    return await this.blocksService.buyBlock(parseInt(id), buyer);
  }

  @Post(':id/sell')
  async sellBlock(
    @Param('id') id: string,
    @Body('seller') seller: string,
    @Body('price') price: string
  ) {
    return await this.blocksService.sellBlock(parseInt(id), seller, price);
  }

  @Post(':id/buy-from-user')
  async buyFromUser(@Param('id') id: string, @Body('buyer') buyer: string) {
    return await this.blocksService.buyFromUser(parseInt(id), buyer);
  }

  @Post(':id/color')
  async setBlockColor(
    @Param('id') id: string,
    @Body('color') color: number,
    @Body('owner') owner: string
  ) {
    return await this.blocksService.setBlockColor(parseInt(id), color, owner);
  }

  @Get(':id')
  async getBlockInfo(@Param('id') id: string): Promise<BlockInfo> {
    return await this.blocksService.getBlockInfo(parseInt(id));
  }

  @Post('buy-multiple')
  async buyMultipleBlocks(@Body('blockIds') blockIds: number[], @Body('buyer') buyer: string) {
    return await this.blocksService.buyMultipleBlocks(blockIds, buyer);
  }

  @Get()
  async getAllBlocksInfo(
    @Query('startId') startId: string,
    @Query('endId') endId: string
  ): Promise<BlockInfo[]> {
    const start = parseInt(startId);
    const end = parseInt(endId);
    return await this.blocksService.getAllBlocksInfo(start, end);
  }
}
