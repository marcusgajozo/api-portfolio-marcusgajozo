import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import { AuthenticationService } from './authentication.service';
import { Request, Response } from 'express';
import { LoginInput } from './dtos/login.input';

@Resolver()
export class AuthenticationResolver {
  constructor(private readonly authenticationService: AuthenticationService) {}

  @Query(() => String)
  health() {
    return 'ok';
  }

  @Mutation(() => Boolean)
  async login(
    @Args('input') input: LoginInput,
    @Context() context: { res: Response },
  ) {
    const { accessToken, refreshToken } =
      await this.authenticationService.login(input);

    context.res.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      maxAge: 15 * 60 * 1000, // 15 minutos
      path: '/',
    });

    context.res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 dias
      path: '/',
    });

    return true;
  }
}
