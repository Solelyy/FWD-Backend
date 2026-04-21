import env from 'dotenv';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import cookieParser from 'cookie-parser';
import { ValidationPipe } from '@nestjs/common';
import { json, urlencoded } from 'express';
const environment = process.env.NODE_ENV || 'development';
const path = `.env.${environment}`;
env.config({ path: path });
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
  try {
    const app = await NestFactory.create(AppModule);

    app.use(json({ limit: '10mb' })); // ← THIS IS THE KEY FIX
    app.use(urlencoded({ extended: true, limit: '10mb' }));

    const cookieSecret = process.env.API_KEY;

    if (!cookieSecret) {
      throw new Error(
        'api-key is required in production. Please set it in your environment variables.',
      );
    } else if (environment !== 'production') {
      console.warn(
        'production env is not set,please set NODE_ENV to production',
      );
    }

    // CORS setup with logging
    app.enableCors({
      origin: (origin, callback) => {
        const allowedOrigins = [
          'http://localhost:3000',
          'https://fwd-frontend.vercel.app',
          'https://fwd-frontend-production.up.railway.app',
        ];

        if (!origin || allowedOrigins.includes(origin)) {
          callback(null, true);
        } else {
          console.warn(`[CORS] Blocked request from origin: ${origin}`);
          callback(new Error(`Origin ${origin} not allowed by CORS`));
        }
      },
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization'],
    });

    //allows transforming queries or params etc.
    app.useGlobalPipes(
      new ValidationPipe({
        transform: true,
        transformOptions: {
          enableImplicitConversion: true,
        },
      }),
    );

    // Preflight OPTIONS handler
    app.use((req, res, next) => {
      if (req.method === 'OPTIONS') {
        res.sendStatus(200);
      } else {
        next();
      }
    });

    // Cookie parser
    app.use(cookieParser(cookieSecret));

    const port = process.env.PORT || 3001;
    await app.listen(port);

    console.log(`Environment: ${environment}`);
    console.log(`Server running on port ${port}`);
    console.log('NODE_ENV:', process.env.NODE_ENV);
    console.log('COOKIE_SECRET:', cookieSecret ? '[SET]' : '[NOT SET]');
  } catch (error) {
    console.error('Server failed to start:', error);
    process.exit(1);
  }
}

startServer();
