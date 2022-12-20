import { Body, Controller, Get, Post } from '@nestjs/common';
import { Ctx, MessagePattern, Payload, RmqContext } from '@nestjs/microservices';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dtos/create-user.dto';
import { ValidateUserDto } from './dtos/validate-user.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  registerUser(@Body() userInfo: CreateUserDto) {
    return this.authService.handleSignup(userInfo)
  }

  @Post('login')
  loginUser(@Body() userInfo: CreateUserDto) {
    return this.authService.handleLogin(userInfo)
  }

  @MessagePattern('validate-user')
  handleUserValidation(@Payload() data: ValidateUserDto, @Ctx() context: RmqContext) {
    console.log('\n validate-user message was recieved')
    console.log('\n the token is:', data.token)
    console.log('\n ready to verify token...')
    return this.authService.verifyToken(data.token)
  }
}
