import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { User } from 'src/user/entities/user.entity';

@Injectable()
export class EmailService {
  constructor(private mailerService: MailerService) {}
  async sendUserWelcome(user: User, password: string) {
    console.log("🚀 ~ EmailService ~ sendUserWelcome ~ password:", password)
    await this.mailerService.sendMail({
      to: user.email,
      subject: 'Welcome to Nice app! Buddy',
      template: './welcome',
      context: {
        name: user.name,
        password: password,
      },
    });
  }
}
