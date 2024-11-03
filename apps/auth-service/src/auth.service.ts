import { Injectable } from '@nestjs/common';
import { ethers } from 'ethers';
import * as jwt from 'jsonwebtoken';
import * as dotenv from 'dotenv';
dotenv.config();

@Injectable()
export class AuthService {
  private readonly JWT_SECRET = process.env.JWT_SECRET;

  async authenticate({ address, timestamp, signature }: { address: string; timestamp: number; signature: string }) {
    const now = Date.now();
    if (now - timestamp > 5 * 60 * 1000) {
      throw new Error('Signature expired');
    }

    const message = `Authenticate for Block Trading App: ${timestamp}`;
    const recoveredAddress = ethers.verifyMessage(message, signature);

    if (recoveredAddress.toLowerCase() !== address.toLowerCase()) {
      throw new Error('Invalid signature');
    }

    const token = jwt.sign({ address }, this.JWT_SECRET, { expiresIn: '1d' });
    return { token };
  }

  verifyToken(token: string) {
    try {
      const payload = jwt.verify(token, this.JWT_SECRET) as { address: string };
      return { isValid: true, address: payload.address };
    } catch {
      return { isValid: false, address: '' };
    }
  }
}