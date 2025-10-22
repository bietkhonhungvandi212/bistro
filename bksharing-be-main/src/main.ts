import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import bodyParser from 'body-parser';
import chalk from 'chalk';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import { cleanEnv, port, str } from 'envalid';
import helmet from 'helmet';
import morgan from 'morgan';

import { APP_SECRET, CREDENTIALS, HOST, NODE_ENV, ORIGIN, PORT } from './app.config';
import { AppModule } from './app.module';
import { LoggingInterceptor } from './interceptors/logging.interceptor';
import { PrismaExceptionInterceptor } from './interceptors/prisma-exception.interceptor';
import { HttpExceptionMiddleware } from './middlewares/http-exception.middlewave';
import { ValidationCustomPipe } from './pipes/validation-custom.pipe';
import { setupSwagger } from './swagger';

async function bootstrap(): Promise<void> {
  try {
    validateEnv();

    const app = await NestFactory.create<NestExpressApplication>(AppModule, {
      logger: ['error', 'warn', 'log', 'verbose'],
      cors: {
        origin: ORIGIN,
        credentials: CREDENTIALS,
      },
    });

    Logger.log(`🚀 Environment: ${chalk.hex('#33d32e').bold(`${NODE_ENV}`)}`);

    app.use(helmet());
    app.use(compression());
    app.use(morgan('combined'));
    app.use(cookieParser(APP_SECRET));
    app.use(bodyParser.json({ limit: '50mb' }));
    app.use(
      bodyParser.urlencoded({
        limit: '50mb',
        extended: true,
        parameterLimit: 50000,
      }),
    );
    // app.use(
    //   rateLimit({
    //     windowMs: 1000 * 60 * 60,
    //     max: 1000, // 1000 requests per windowMs
    //     message: '🚫  Too many request created from this IP, please try again after an hour',
    //   }),
    // );

    app.useGlobalInterceptors(new LoggingInterceptor());
    app.useGlobalInterceptors(new PrismaExceptionInterceptor());
    app.useGlobalPipes(ValidationCustomPipe.compactVersion());
    app.useGlobalFilters(new HttpExceptionMiddleware());
    app.setGlobalPrefix('api/v1');

    // Swagger
    setupSwagger(app);

    await app.listen(PORT || 3000);

    if (NODE_ENV !== 'production') {
      Logger.log(`🪭 Server ready at http://${chalk.hex('#e5ff00').bold(`${HOST}`)}:${chalk.hex('#ff6e26').bold(`${PORT}`)}`);
    } else {
      Logger.log(`🪽 Server is listening on port ${chalk.hex('#87e8de').bold(`${PORT}`)}`);
    }
    Logger.log(
      `📚 Swagger ready at http://${chalk.hex('#e5ff00').bold(`${HOST}`)}:${chalk.hex('#ff6e26').bold(`${PORT}`)}/documentation`,
    );
  } catch (error) {
    Logger.error(`❌  Error starting server, ${error}`);
    process.exit();
  }
}

function validateEnv() {
  cleanEnv(process.env, {
    DATABASE_URL: str(),
    PORT: port(),
  });
}

bootstrap().catch((e) => {
  Logger.error(`❌  Error starting server, ${e}`);
  throw e;
});
