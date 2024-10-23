import { Test, TestingModule } from '@nestjs/testing';
import { BlocksService } from './blocks.service';
import { BlockchainService } from '../blockchain/blockchain.service';

// Мок для BlockchainService
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

  describe('getBlockOwner', () => {
    it('should return the owner of a block', async () => {
      const mockOwner = '0x1234567890123456789012345678901234567890';
      blockchainService.getBlockOwner.mockResolvedValue(mockOwner);

      const result = await service.getBlockOwner(1);
      expect(result).toBe(mockOwner);
      expect(blockchainService.getBlockOwner).toHaveBeenCalledWith(1);
    });
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

  describe('changeBlockColor', () => {
    it('should change the color of a block', async () => {
      const mockOwner = '0x1234567890123456789012345678901234567890';
      blockchainService.changeBlockColor.mockResolvedValue(true);

      const result = await service.changeBlockColor(1, 'black', mockOwner);
      expect(result).toBe(true);
      expect(blockchainService.changeBlockColor).toHaveBeenCalledWith(1, 'black', mockOwner);
    });
  });

  describe('getBlockColor', () => {
    it('should return the color of a block', async () => {
      const mockColor = 'black';
      blockchainService.getBlockColor.mockResolvedValue(mockColor);

      const result = await service.getBlockColor(1);
      expect(result).toBe(mockColor);
      expect(blockchainService.getBlockColor).toHaveBeenCalledWith(1);
    });
  });
});
