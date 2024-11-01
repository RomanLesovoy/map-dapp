import { Controller, Post, Body } from '@nestjs/common';
import { Inject, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@Controller('auth')
@ApiTags('auth')
export class AuthController implements OnModuleInit {
  private authService: any;

  constructor(@Inject('AUTH_SERVICE') private authClient: ClientGrpc) {}

  onModuleInit() {
    this.authService = this.authClient.getService('AuthService');
  }

  @Post()
  @ApiOperation({ summary: 'Authenticate user' })
  async authenticate(@Body() authData: { address: string; timestamp: number; signature: string }) {
    return firstValueFrom(this.authService.authenticate(authData));
  }
} 