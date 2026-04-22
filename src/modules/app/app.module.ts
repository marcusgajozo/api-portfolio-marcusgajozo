import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { AuthenticationModule } from '../authentication/authentication.module';
import { DatabaseModule } from '../database/database.module';
import { UsersModule } from '../users/users.module';
import { Request, Response } from 'express';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { JwtModule } from '@nestjs/jwt';

// TODO: criar o modulo de projetos
// TODO: criar o modulo de artigos
// TODO: conectar na api do LinkedIn para pegar a foto
// TODO: conectar na api do GitHub para pegar os projetos
// TODO: conectar na api do Linkedin para publicar os artigos
// TODO: configurar ambiente de produção e configurar o Dockerfile
// TODO: adicionar o commitlint, commitizen e o husky para padronizar os commits

@Module({
  imports: [
    ConfigModule.forRoot(),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: true,
      graphiql: true,
      context: ({ req, res }: { req: Request; res: Response }) => ({
        req,
        res,
      }),
    }),
    DatabaseModule,
    AuthenticationModule,
    UsersModule,
    JwtModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}
