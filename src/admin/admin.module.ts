import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { JwtModule } from '@nestjs/jwt';
import { configCredentials } from 'src/config/config';

@Module({
  imports: [
    JwtModule.register({
      secret: configCredentials.JWTSECRET, // Replace with your actual secret key
      signOptions: { expiresIn: '1h' }, // Example options, adjust as needed
    }),
  ],
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {}
