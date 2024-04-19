import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { VERSION_NEUTRAL, VersioningType } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';
import { IoAdapter } from '@nestjs/platform-socket.io';
import { CustomLogger } from 'utils/logger';

async function bootstrap() {
  const app = await NestFactory.create(
    AppModule,
    // the console shows the logs from the CustomLogger
    //    {
    //   logger: new CustomLogger(),
    // }
  );
  //swagger
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: VERSION_NEUTRAL,
  });
  app.use(cookieParser());
  app.useWebSocketAdapter(new IoAdapter());
  const config = new DocumentBuilder()
    .setTitle('Cats example')
    .setDescription('The cats API description')
    .setVersion('1.0')
    .addTag('Nest JS Role Based Auth API')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        description: 'Enter your JWT token',
      },
      'jwt',
    )
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document, {
    explorer: true,
    customSiteTitle: 'Nest JS Role Based Auth API',
    customfavIcon: 'https://www.google.com/favicon.ico',
    swaggerOptions: {
      persistAuthrization: true,
    },
  });
  await app.listen(3000);
}
bootstrap();
