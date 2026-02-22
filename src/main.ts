import env from 'dotenv';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import cookieParser from 'cookie-parser';

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
