import { Controller, Get, Post, Param, Body, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody, ApiQuery } from '@nestjs/swagger';
import { BlocksService } from './blocks.service';
import { BlockInfo } from '../blockchain/blockchain.service';
import { AuthGuard } from '../auth/auth.guard';
import { TransactionResponse } from 'ethers';
@ApiTags('blocks')
@Controller('blocks')
@UseGuards(AuthGuard)
export class BlocksController {
  constructor(private readonly blocksService: BlocksService) {}


  @Get(':id')
  @ApiOperation({ summary: 'Get block info' })
  @ApiParam({ name: 'id', type: 'number' })
  @ApiResponse({ status: 200, description: 'Returns the block info.', type: BlockInfo })
  async getBlockInfo(@Param('id') id: string): Promise<BlockInfo> {
    return await this.blocksService.getBlockInfo(parseInt(id));
  }

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

  @Post(':id/color')
  @ApiOperation({ summary: 'Set block color' })
  @ApiParam({ name: 'id', type: 'number' })
  @ApiBody({ schema: { properties: { color: { type: 'number' } } } })
  @ApiResponse({ status: 200, description: 'Block color updated successfully.' })
  async setBlockColor(
    @Param('id') id: string,
    @Body('color') color: number
  ): Promise<TransactionResponse> {
    return await this.blocksService.setBlockColor(parseInt(id), color);
  }

  @Post(':id/color-transaction')
  @ApiOperation({ summary: 'Set block color' })
  @ApiParam({ name: 'id', type: 'number' })
  @ApiBody({ schema: { properties: { color: { type: 'number' } } } })
  @ApiResponse({ status: 200, description: 'Block color updated successfully.' })
  async setBlockColorPrepareTransaction(
    @Param('id') id: string,
    @Body('color') color: number
  ): Promise<{ data: string }> {
    const data = await this.blocksService.setBlockColorPrepareTransaction(parseInt(id), color);
    return { data };
  }

  @Post(':id/price')
  @ApiOperation({ summary: 'Set block price' })
  @ApiParam({ name: 'id', type: 'number' })
  @ApiBody({ schema: { properties: { price: { type: 'string' } } } })
  @ApiResponse({ status: 200, description: 'Block price updated successfully.' })
  async setBlockPrice(
    @Param('id') id: string,
    @Body('price') price: string
  ): Promise<TransactionResponse> {
    return await this.blocksService.setBlockPrice(parseInt(id), price);
  }
  
  @Post(':id/price-transaction')
  @ApiOperation({ summary: 'Get data for setting block price' })
  @ApiParam({ name: 'id', type: 'number' })
  @ApiBody({ schema: { properties: { price: { type: 'string' } } } })
  @ApiResponse({ status: 200, description: 'Returns the data for setting block price.' })
  async getSetPriceData(
    @Param('id') id: string,
    @Body('price') price: string
  ): Promise<{ data: string }> {
    const data = await this.blocksService.setBlockPricePrepareTransaction(parseInt(id), price);
    return { data };
  }

  @Post(':id/buy')
  @ApiOperation({ summary: 'Buy block' })
  @ApiParam({ name: 'id', type: 'number' })
  @ApiResponse({ status: 200, description: 'Block bought successfully.' })
  async buyBlock(@Param('id') id: string): Promise<TransactionResponse> {
    return await this.blocksService.buyBlock(parseInt(id));
  }

  @Get(':txHash/logs')
  @ApiOperation({ summary: 'Get transaction logs' })
  @ApiParam({ name: 'txHash', type: 'string' })
  @ApiResponse({ status: 200, description: 'Returns the transaction logs.' })
  async getTransactionLogs(@Param('txHash') txHash: string) {
    return await this.blocksService.getTransactionLogs(txHash);
  }

  @Post(':id/cache')
  @ApiOperation({ summary: 'Update cache' })
  @ApiParam({ name: 'id', type: 'number' })
  @ApiResponse({ status: 200, description: 'Cache updated successfully.' })
  async updateCache(@Param('id') id: string) {
    return await this.blocksService.updateBlockInfoCache(parseInt(id));
  }

  @Post(':id/buy-transaction')
  @ApiOperation({ summary: 'Get data for buying block' })
  @ApiParam({ name: 'id', type: 'number' })
  @ApiResponse({ status: 200, description: 'Returns the data for buying block.' })
  async getBuyData(
    @Param('id') id: string
  ): Promise<{ data: string }> {
    const data = await this.blocksService.buyBlockPrepareTransaction(parseInt(id));
    return { data };
  }
}
