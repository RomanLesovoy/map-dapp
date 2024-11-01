import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { AuthService } from './auth.service';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @GrpcMethod('AuthService', 'Authenticate')
  async authenticate(data: { address: string; timestamp: number; signature: string }) {
    return this.authService.authenticate(data);
  }

  @GrpcMethod('AuthService', 'VerifyToken')
  async verifyToken(data: { token: string }) {
    return this.authService.verifyToken(data.token);
  }
} 