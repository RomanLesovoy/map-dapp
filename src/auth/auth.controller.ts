import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post()
  async authenticate(@Body() authData: { address: string; timestamp: number; signature: string }) {
    return this.authService.authenticate(authData);
  }
}
