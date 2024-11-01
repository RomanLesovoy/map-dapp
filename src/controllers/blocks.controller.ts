import { Controller, Get, Post, Body, Param, Query, UseGuards } from '@nestjs/common';
import { Inject, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { ApiTags, ApiOperation, ApiParam, ApiQuery, ApiBody } from '@nestjs/swagger';
import { AuthGuard } from '../guards/auth.guard';

@Controller('blocks')
@ApiTags('blocks')
@UseGuards(AuthGuard)
export class BlocksController implements OnModuleInit {
  private blocksService: any;

  constructor(@Inject('BLOCKS_SERVICE') private blocksClient: ClientGrpc) {}

  onModuleInit() {
    this.blocksService = this.blocksClient.getService('BlocksService');
  }

  @Get('queue')
  @ApiOperation({ summary: 'Get all blocks info (Queue)' })
  @ApiQuery({ name: 'startId', type: 'number' })
  @ApiQuery({ name: 'endId', type: 'number' })
  async queueBlocksInfo(
    @Query('startId') startId: string,
    @Query('endId') endId: string,
  ) {
    return firstValueFrom(
      this.blocksService.getBlocksInfo({
        startId: parseInt(startId),
        endId: parseInt(endId),
      })
    );
  }

  // todo add types for Response
  @Get(':id')
  @ApiOperation({ summary: 'Get block info' })
  @ApiParam({ name: 'id', type: 'number' })
  async getBlockInfo(@Param('id') id: string) {
    return firstValueFrom(
      this.blocksService.getBlockInfo({ blockId: parseInt(id) })
    );
  }

  @Get()
  @ApiOperation({ summary: 'Get all blocks info' })
  @ApiQuery({ name: 'startId', type: 'number' })
  @ApiQuery({ name: 'endId', type: 'number' })
  async getAllBlocksInfo(
    @Query('startId') startId: string,
    @Query('endId') endId: string
  ) {
    return firstValueFrom(this.blocksService.getAllBlocksInfo(parseInt(startId), parseInt(endId)));
  }

  @Post(':id/color')
  @ApiOperation({ summary: 'Set block color' })
  @ApiParam({ name: 'id', type: 'number' })
  @ApiBody({ schema: { properties: { color: { type: 'number' } } } })
  async setBlockColor(
    @Param('id') id: string,
    @Body('color') color: number
  ) {
    return firstValueFrom(this.blocksService.setBlockColor(parseInt(id), color));
  }

  @Post(':id/color-transaction')
  @ApiOperation({ summary: 'Set block color' })
  @ApiParam({ name: 'id', type: 'number' })
  @ApiBody({ schema: { properties: { color: { type: 'number' } } } })
  async setBlockColorPrepareTransaction(
    @Param('id') id: string,
    @Body('color') color: number
  ) {
    return firstValueFrom(this.blocksService.setBlockColorPrepareTransaction(parseInt(id), color));
  }

  @Post(':id/price')
  @ApiOperation({ summary: 'Set block price' })
  @ApiParam({ name: 'id', type: 'number' })
  @ApiBody({ schema: { properties: { price: { type: 'string' } } } })
  async setBlockPrice(
    @Param('id') id: string,
    @Body('price') price: string
  ) {
    return firstValueFrom(this.blocksService.setBlockPrice(parseInt(id), price));
  }
  
  @Post(':id/price-transaction')
  @ApiOperation({ summary: 'Get data for setting block price' })
  @ApiParam({ name: 'id', type: 'number' })
  @ApiBody({ schema: { properties: { price: { type: 'string' } } } })
  async getSetPriceData(
    @Param('id') id: string,
    @Body('price') price: string
  ) {
    return firstValueFrom(this.blocksService.setBlockPricePrepareTransaction(parseInt(id), price));
  }

  @Post(':id/buy')
  @ApiOperation({ summary: 'Buy block' })
  @ApiParam({ name: 'id', type: 'number' })
  async buyBlock(@Param('id') id: string) {
    return firstValueFrom(this.blocksService.buyBlock(parseInt(id)));
  }

  @Get(':txHash/logs')
  @ApiOperation({ summary: 'Get transaction logs' })
  @ApiParam({ name: 'txHash', type: 'string' })
  async getTransactionLogs(@Param('txHash') txHash: string) {
    return firstValueFrom(this.blocksService.getTransactionLogs(txHash));
  }

  @Post(':id/cache')
  @ApiOperation({ summary: 'Update cache' })
  @ApiParam({ name: 'id', type: 'number' })
  async updateCache(@Param('id') id: string) {
    return firstValueFrom(this.blocksService.updateBlockInfoCache(parseInt(id)));
  }

  @Post(':id/buy-transaction')
  @ApiOperation({ summary: 'Get data for buying block' })
  @ApiParam({ name: 'id', type: 'number' })
  async getBuyData(
    @Param('id') id: string
  ) {
    return firstValueFrom(this.blocksService.buyBlockPrepareTransaction(parseInt(id)));
  }
} 