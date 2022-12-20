import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { compare, genSalt, hash } from 'bcrypt';
import { sign, verify } from 'jsonwebtoken';
import { CreateUserDto } from './dtos/create-user.dto';
import { UserDocument } from './users/user.schema';
import { UsersService } from './users/users.service';

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private configService: ConfigService
    ) { }
  
  async handleSignup(userInfo: CreateUserDto) {
      // check if this email isn't in the database
      const user = await this.usersService.findUserByEmail(userInfo.email)
      if (user) throw new BadRequestException('account with this email already exists')
      //hash password
      userInfo.password = await this.encryptPassword(userInfo.password)
      // add user to the database
      const newUser = await this.usersService.addUser(userInfo)
      const JWT = this.generateJWT({id: newUser.id, email: newUser.email})
      return { token: JWT, user : {  id: newUser.id, email: newUser.email } }
  }

  async handleLogin(userInfo: CreateUserDto) {
      const { email, password: enteredPassword } = userInfo
      // check if this email exists in the database
      const user = await this.usersService.findUserByEmail(email)
      if (!user) throw new UnauthorizedException('there is no account with this gmail')
      // check the entered password is correct
      await this.checkPassword(enteredPassword, user.password)
      
      const JWT = this.generateJWT({ id: user.id })
      return { token: JWT, user : {  id: user.id, email: user.email } }
  }

  async encryptPassword(password: string) {
      const salt = await genSalt(10)
      return hash(password, salt)
  }

  generateJWT(info: Partial<UserDocument>) {
      return sign(
          info,
          this.configService.get<string>('JWT_SECRET'),
          { expiresIn: this.configService.get<string>('JWT_LIFETIME') }
      )
  }

  async checkPassword(passToCheck: string, encryptedPass: string) {
      const isPasswordCorrect = await compare(passToCheck, encryptedPass)
      if(!isPasswordCorrect) throw new UnauthorizedException('password incorrect')
  }
    
    async verifyToken(token: string) {
        try {
            console.log('\n verifying the token...')
            const decoded: any = verify(
                token,
                this.configService.get<string>('JWT_SECRET')
            )
            console.log('\n token was successfully verified', decoded)
            return this.usersService.findUserById(decoded.id)
        } catch (error) {
            throw new BadRequestException('unable to verify token')
        }
    }
}
