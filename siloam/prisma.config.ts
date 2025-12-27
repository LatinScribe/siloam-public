// prisma.config.ts
import 'dotenv/config'; // Make sure your environment variables are loaded
import { defineConfig, env } from '@prisma/config';

export default defineConfig({
  schema: './prisma/schema.prisma', // Path to your schema file
  datasource: {
    url: env('DATABASE_URL'), // Configure the URL using an environment variable
  },
  // You can also configure other fields like shadowDatabaseUrl here
  // shadowDatabaseUrl: env('SHADOW_DATABASE_URL'),
});
