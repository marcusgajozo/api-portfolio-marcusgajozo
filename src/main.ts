import { NestFactory } from '@nestjs/core';
import { AppModule } from './modules/app/app.module';
import type { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';
import cookieParser from 'cookie-parser';

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

  app.use(cookieParser());

  await app.listen(process.env.API_PORT ?? 3000);
}

void bootstrap();
