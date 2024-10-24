import { Injectable } from '@nestjs/common';
import { ethers } from 'ethers';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class AuthService {
  private readonly JWT_SECRET = process.env.JWT_SECRET;

  async authenticate({ address, timestamp, signature }: { address: string; timestamp: number; signature: string }) {
    // Verify that the timestamp is recent (within 5 minutes)
    const now = Date.now();
    if (now - timestamp > 5 * 60 * 1000) {
      throw new Error('Signature expired');
    }

    // Recreate the message that was signed
    const message = `Authenticate for Block Trading App: ${timestamp}`;

    // Recover the address from the signature
    const recoveredAddress = ethers.verifyMessage(message, signature);

    // Check if the recovered address matches the provided address
    if (recoveredAddress.toLowerCase() !== address.toLowerCase()) {
      throw new Error('Invalid signature');
    }

    // If everything is valid, create a JWT token
    const token = jwt.sign({ address }, this.JWT_SECRET, { expiresIn: '1d' });

    return { token };
  }

  verifyToken(token: string): { address: string } {
    try {
      return jwt.verify(token, this.JWT_SECRET) as { address: string };
    } catch (error) {
      throw new Error('Invalid token');
    }
  }
}
