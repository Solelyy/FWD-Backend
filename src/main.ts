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
  const envPath = `.env.${environment}`;

  env.config({ path: envPath });

  const app = await NestFactory.create(AppModule);

  app.use(cookieParser(process.env.COOKIE_SECRET));
  if (!process.env.COOKIE_SECRET) {
    throw new Error('COOKIE_SECRET is not defined. Set it in your environment variables (railway).');
  }

  app.enableCors({
    origin: [
      'http://localhost:3000',
      'https://fwd-frontend.vercel.app/',
    ],
    credentials: true,
  });

  const port = process.env.PORT || 3000;
  await app.listen(port);

  console.log(`Environment: ${environment}`);
  console.log(`Server running on port ${port}`);
}

startServer();