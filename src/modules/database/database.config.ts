import { registerAs } from '@nestjs/config';

export const databaseConfig = registerAs('mongodb', () => ({
  url: process.env.MONGODB_URL || '',
}));
