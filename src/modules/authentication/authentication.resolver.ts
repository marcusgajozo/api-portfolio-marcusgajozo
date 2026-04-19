import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { AuthenticationService } from './authentication.service';
import { LoginInput } from './dtos/login.input';
import { AuthResponse } from './dtos/auth-response.type';

@Resolver()
export class AuthenticationResolver {
  constructor(private readonly authenticationService: AuthenticationService) {}

  @Query(() => String)
  health() {
    return 'ok';
  }

  @Mutation(() => AuthResponse)
  login(@Args('input') input: LoginInput) {
    return this.authenticationService.login(input);
  }
}
