import { NestFactory } from '@nestjs/core';
import { AppModule } from './modules/app/app.module';
import cookieParser from 'cookie-parser';

// TODO: ajustar a tipagem Cors

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const whitelist = process.env.CORS_WHITELIST
    ? process.env.CORS_WHITELIST.split(',')
    : [];

  app.enableCors({
    origin: (origin, callback) => {
      if (!origin || whitelist.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Não permitido pelo CORS'));
      }
    },
    credentials: true,
  });

  app.use(cookieParser());

  await app.listen(process.env.PORT ?? 3000);
}

void bootstrap();
