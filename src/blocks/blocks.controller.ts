import { Controller, Get, Post, Param, Body } from '@nestjs/common';
import { BlocksService } from './blocks.service';

@Controller('blocks')
export class BlocksController {
  constructor(private readonly blocksService: BlocksService) {}

  @Get(':id/owner')
  async getBlockOwner(@Param('id') id: string) {
    return await this.blocksService.getBlockOwner(parseInt(id));
  }

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

  @Post(':id/color')
  async changeBlockColor(
    @Param('id') id: string,
    @Body('color') color: 'black' | 'white',
    @Body('owner') owner: string
  ) {
    return await this.blocksService.changeBlockColor(parseInt(id), color, owner);
  }

  @Get(':id/color')
  async getBlockColor(@Param('id') id: string) {
    return await this.blocksService.getBlockColor(parseInt(id));
  }
}
