import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(private configService: ConfigService) {
    const clientId = configService.get('GOOGLE_CLIENT_ID');
    const clientSecretKey = configService.get('GOOGLE_CLIENT_SECRET');
    const callbackURLKey = configService.get('GOOGLE_CALLBACK_URL');

    if ((clientId || clientSecretKey || callbackURLKey) === undefined) {
      const checkIsExist =
        clientId === undefined
          ? `clinetId is missing in .env`
          : clientSecretKey === undefined
            ? 'google client secretkey is missing in .env'
            : callbackURLKey === undefined
              ? 'google callback url is missing in .env'
              : '';
      throw new Error(checkIsExist);
    }

    super({
      clientID: clientId,
      clientSecret: clientSecretKey,
      callbackURL: callbackURLKey,
      scope: ['email', 'profile'],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: VerifyCallback,
  ) {
    console.log(
      '🚀 ~ GoogleStrategy ~ classGoogleStrategyextendsPassportStrategy ~ name, emails, photos:',
      profile,
    );
    done(null, profile);
  }
}
