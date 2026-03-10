import env from 'dotenv';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import cookieParser from 'cookie-parser';

/*
async function startServer() {
  const environment = process.env.NODE_ENV || 'development';
  const envPath = `.env.${environment}`; //change the env value

  env.config({ path: envPath });

  //destructure env dev
  const { PORT, NODE_ENV, ...otherEnv } = process.env;

  const app = await NestFactory.create(AppModule);

  //use at routes params
  app.use(cookieParser('cookiesecretkey'));

  app.enableCors({
    origin: 'http://localhost:3000',
    credentials: true,
  });
  await app.listen(PORT ?? 3001);

  console.log('ur at:', NODE_ENV);
  console.log('server starting at localhost:', PORT);
}
startServer();
*/

async function startServer() {
  const environment = process.env.NODE_ENV || 'development';

  // Load .env only in development
  if (environment === 'development') {
    const envPath = `.env.${environment}`;
    env.config({ path: envPath });
  }

  const app = await NestFactory.create(AppModule);

  const cookieSecret = process.env.COOKIE_SECRET;
  if (!cookieSecret && environment === 'production') {
    throw new Error(
      'COOKIE_SECRET is required in production. Please set it in your environment variables.'
    );
  }

  // In dev, fallback to a default key
  app.use(cookieParser(cookieSecret || 'dev-cookie-secret'));

  const origin = environment === 'development'
    ? 'http://localhost:3000'
    : 'https://fwd-frontend.vercel.app';

  app.enableCors({
    origin,
    credentials: true,
  });

  const port = process.env.PORT || 3001;
  await app.listen(port);

  console.log(`Environment: ${environment}`);
  console.log(`Server running on port ${port}`);
  console.log(`Allowed CORS origin: ${origin}`);
}

startServer();