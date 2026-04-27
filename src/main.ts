import { NestFactory } from '@nestjs/core';
import { AppModule } from './modules/app/app.module';
import type { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';
import cookieParser from 'cookie-parser';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const whitelist = process.env.CORS_WHITELIST
    ? process.env.CORS_WHITELIST.split(',')
    : [];

  const corsOptions: CorsOptions = {
    origin: (
      origin: string | undefined,
      callback: (err: Error | null, origin?: boolean) => void,
    ) => {
      if (!origin || whitelist.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Não permitido pelo CORS'));
      }
    },
    credentials: true,
  };

  app.enableCors(corsOptions);

  app.useGlobalPipes(new ValidationPipe({ forbidNonWhitelisted: true }));

  app.use(cookieParser());

  await app.listen(Number(process.env.API_PORT));
}

void bootstrap();
