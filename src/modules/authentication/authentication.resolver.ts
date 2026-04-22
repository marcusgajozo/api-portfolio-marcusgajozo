import { Public } from '@/common/decorators/public.decorator';
import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Response } from 'express';
import { AuthenticationService } from './authentication.service';
import { LoginInput } from './dtos/login.input';

const IS_PRODUCTION = process.env.NODE_ENV === 'production';

@Resolver()
export class AuthenticationResolver {
  constructor(private readonly authenticationService: AuthenticationService) {}

  @Query(() => String)
  health() {
    return 'ok';
  }

  @Public()
  @Mutation(() => Boolean)
  async login(
    @Args('input') input: LoginInput,
    @Context() context: { res: Response },
  ) {
    const { accessToken, refreshToken } =
      await this.authenticationService.login(input);

    context.res.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: IS_PRODUCTION,
      sameSite: IS_PRODUCTION ? 'none' : 'lax',
      maxAge: 15 * 60 * 1000, // 15 minutos
      path: '/',
    });

    context.res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: IS_PRODUCTION,
      sameSite: IS_PRODUCTION ? 'none' : 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 dias
      path: '/',
    });

    return true;
  }
}
