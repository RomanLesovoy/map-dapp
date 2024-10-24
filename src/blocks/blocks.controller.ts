import { Controller, Get, Post, Param, Body, Query, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody, ApiQuery } from '@nestjs/swagger';
import { BlocksService } from './blocks.service';
import { BlockInfo } from '../blockchain/blockchain.service';
import { AuthGuard } from '../auth/auth.guard';

@ApiTags('blocks')
@Controller('blocks')
@UseGuards(AuthGuard)
export class BlocksController {
  constructor(private readonly blocksService: BlocksService) {}

  @Post(':id/buy')
  @ApiOperation({ summary: 'Buy a block' })
  @ApiParam({ name: 'id', type: 'number' })
  @ApiBody({ schema: { properties: { buyer: { type: 'string' } } } })
  @ApiResponse({ status: 200, description: 'The block has been successfully bought.' })
  async buyBlock(@Param('id') id: string, @Request() req) {
    const userAddress = req.user.address;
    return await this.blocksService.buyBlock(parseInt(id), userAddress);
  }

  @Post(':id/sell')
  @ApiOperation({ summary: 'Sell a block' })
  @ApiParam({ name: 'id', type: 'number' })
  @ApiBody({ schema: { properties: { seller: { type: 'string' }, price: { type: 'string' } } } })
  @ApiResponse({ status: 200, description: 'The block has been successfully put up for sale.' })
  async sellBlock(
    @Param('id') id: string,
    @Body('seller') seller: string,
    @Body('price') price: string
  ) {
    return await this.blocksService.sellBlock(parseInt(id), seller, price);
  }

  @Post(':id/buy-from-user')
  @ApiOperation({ summary: 'Buy a block from another user' })
  @ApiParam({ name: 'id', type: 'number' })
  @ApiBody({ schema: { properties: { buyer: { type: 'string' } } } })
  @ApiResponse({ status: 200, description: 'The block has been successfully bought from another user.' })
  async buyFromUser(@Param('id') id: string, @Body('buyer') buyer: string) {
    return await this.blocksService.buyFromUser(parseInt(id), buyer);
  }

  @Post(':id/color')
  @ApiOperation({ summary: 'Set block color' })
  @ApiParam({ name: 'id', type: 'number' })
  @ApiBody({ schema: { properties: { color: { type: 'number' }, owner: { type: 'string' } } } })
  @ApiResponse({ status: 200, description: 'The block color has been successfully set.' })
  async setBlockColor(
    @Param('id') id: string,
    @Body('color') color: number,
    @Body('owner') owner: string
  ) {
    return await this.blocksService.setBlockColor(parseInt(id), color, owner);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get block info' })
  @ApiParam({ name: 'id', type: 'number' })
  @ApiResponse({ status: 200, description: 'Returns the block info.', type: BlockInfo })
  async getBlockInfo(@Param('id') id: string): Promise<BlockInfo> {
    return await this.blocksService.getBlockInfo(parseInt(id));
  }

  @Post('buy-multiple')
  @ApiOperation({ summary: 'Buy multiple blocks' })
  @ApiBody({ schema: { properties: { blockIds: { type: 'array', items: { type: 'number' } }, buyer: { type: 'string' } } } })
  @ApiResponse({ status: 200, description: 'The blocks have been successfully bought.' })
  async buyMultipleBlocks(@Body('blockIds') blockIds: number[], @Body('buyer') buyer: string) {
    return await this.blocksService.buyMultipleBlocks(blockIds, buyer);
  }

  /**
   * todo maybe load only 100 blocks at a time
   * todo maybe add pagination
   * todo maybe load blocks colors
   * 
   * @param startId 
   * @param endId 
   * @returns 
   */
  @Get()
  @ApiOperation({ summary: 'Get all blocks info' })
  @ApiQuery({ name: 'startId', type: 'number' })
  @ApiQuery({ name: 'endId', type: 'number' })
  @ApiResponse({ status: 200, description: 'Returns the info for all blocks in the specified range.', type: [BlockInfo] })
  async getAllBlocksInfo(
    @Query('startId') startId: string,
    @Query('endId') endId: string
  ): Promise<BlockInfo[]> {
    const start = parseInt(startId);
    const end = parseInt(endId);
    return await this.blocksService.getAllBlocksInfo(start, end);
  }
}
