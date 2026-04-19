import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { UsersModule } from '../users/users.module';
import { AuthenticationResolver } from './authentication.resolver';
import { AuthenticationService } from './authentication.service';

@Module({
  imports: [
    UsersModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'dev-secret',
      signOptions: { expiresIn: '1d' },
    }),
  ],
  providers: [AuthenticationResolver, AuthenticationService],
})
export class AuthenticationModule {}
