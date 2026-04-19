import { Module } from '@nestjs/common';
import { ConfigModule, ConfigType } from '@nestjs/config';
import mongoose from 'mongoose';
import { databaseConfig } from './database.config';

export const DATABASE_CONNECTION = 'DATABASE_CONNECTION';

@Module({
  imports: [ConfigModule.forFeature(databaseConfig)],
  providers: [
    {
      inject: [databaseConfig.KEY],
      provide: DATABASE_CONNECTION,
      useFactory: (config: ConfigType<typeof databaseConfig>) =>
        mongoose.connect(config.url),
    },
  ],
  exports: [DATABASE_CONNECTION],
})
export class DatabaseModule {}
