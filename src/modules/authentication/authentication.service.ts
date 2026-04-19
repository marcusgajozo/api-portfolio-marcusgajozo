import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
// import { UsersService } from '../users/users.service';
import { LoginInput } from './dtos/login.input';

@Injectable()
export class AuthenticationService {
  constructor(
    // private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  login(input: LoginInput) {
    console.log('Login attempt:', input);
    // const user = await this.usersService.findByEmail(input.email);

    // if (!user) {
    //   throw new UnauthorizedException('Invalid credentials');
    // }

    // const passwordMatches = await bcrypt.compare(input.password, user.password);

    // if (!passwordMatches) {
    //   throw new UnauthorizedException('Invalid credentials');
    // }

    // const accessToken = await this.jwtService.signAsync({
    //   sub: user.id,
    //   email: user.email,
    // });

    return {
      accessToken: 'fake-jwt-token',
      // user,
    };
  }
}
