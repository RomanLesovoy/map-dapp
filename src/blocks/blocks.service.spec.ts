import { Test, TestingModule } from '@nestjs/testing';
import { BlocksService } from './blocks.service';
import { BlockchainService, BlockInfo } from '../blockchain/blockchain.service';
import { ethers } from 'ethers';

// Mock for BlockchainService
jest.mock('../blockchain/blockchain.service');

describe('BlocksService', () => {
  let service: BlocksService;
  let blockchainService: jest.Mocked<BlockchainService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BlocksService, BlockchainService],
    }).compile();

    service = module.get<BlocksService>(BlocksService);
    blockchainService = module.get(BlockchainService) as jest.Mocked<BlockchainService>;
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('buyBlock', () => {
    it('should buy a block', async () => {
      const mockBuyer = '0x1234567890123456789012345678901234567890';
      blockchainService.buyBlock.mockResolvedValue(true);

      const result = await service.buyBlock(1, mockBuyer);
      expect(result).toBe(true);
      expect(blockchainService.buyBlock).toHaveBeenCalledWith(1, mockBuyer);
    });
  });

  describe('sellBlock', () => {
    it('should sell a block', async () => {
      const mockSeller = '0x1234567890123456789012345678901234567890';
      const mockPrice = '0.1';
      blockchainService.sellBlock.mockResolvedValue(true);

      const result = await service.sellBlock(1, mockSeller, mockPrice);
      expect(result).toBe(true);
      expect(blockchainService.sellBlock).toHaveBeenCalledWith(1, mockSeller, mockPrice);
    });
  });

  describe('buyFromUser', () => {
    it('should buy a block from another user', async () => {
      const mockBuyer = '0x1234567890123456789012345678901234567890';
      blockchainService.buyFromUser.mockResolvedValue(true);

      const result = await service.buyFromUser(1, mockBuyer);
      expect(result).toBe(true);
      expect(blockchainService.buyFromUser).toHaveBeenCalledWith(1, mockBuyer);
    });
  });

  describe('setBlockColor', () => {
    it('should set the color of a block', async () => {
      const mockOwner = '0x1234567890123456789012345678901234567890';
      const mockColor = 1;
      blockchainService.setBlockColor.mockResolvedValue(true);

      const result = await service.setBlockColor(1, mockColor, mockOwner);
      expect(result).toBe(true);
      expect(blockchainService.setBlockColor).toHaveBeenCalledWith(1, mockColor, mockOwner);
    });
  });

  describe('getBlockInfo', () => {
    it('should return block info', async () => {
      const mockBlockInfo: BlockInfo = {
        owned: true,
        owner: '0x1234567890123456789012345678901234567890',
        color: 1,
        price: '0.1'
      };
      blockchainService.getBlockInfo.mockResolvedValue(mockBlockInfo);

      const result = await service.getBlockInfo(1);
      expect(result).toEqual(mockBlockInfo);
      expect(blockchainService.getBlockInfo).toHaveBeenCalledWith(1);
    });
  });

  describe('buyMultipleBlocks', () => {
    it('should buy multiple blocks', async () => {
      const mockBuyer = '0x1234567890123456789012345678901234567890';
      const mockBlockIds = [1, 2, 3];
      blockchainService.buyMultipleBlocks.mockResolvedValue(true);

      const result = await service.buyMultipleBlocks(mockBlockIds, mockBuyer);
      expect(result).toBe(true);
      expect(blockchainService.buyMultipleBlocks).toHaveBeenCalledWith(mockBlockIds, mockBuyer);
    });
  });

  describe('getAllBlocksInfo', () => {
    it('should return block info for a range of blocks', async () => {
      const mockBlocksInfo: BlockInfo[] = [
        { owned: true, owner: '0x123...', color: 1, price: ethers.parseEther('0.1').toString() },
        { owned: false, owner: '0x000...', color: 0, price: ethers.parseEther('0').toString() },
      ];
      blockchainService.getAllBlocksInfo.mockResolvedValue(mockBlocksInfo);

      const result = await service.getAllBlocksInfo(0, 1);
      expect(result).toEqual(mockBlocksInfo);
      expect(blockchainService.getAllBlocksInfo).toHaveBeenCalledWith(0, 1);
    });
  });
});
