import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';

@Catch()
export class TokenErrorFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp(); // what it does is that it switches the context to the HTTP context and then we can get the response object from it.
    const response = ctx.getResponse(); // get the response object
    const status = exception.getStatus(); // get the status code of the exception
    console.log('🚀 ~ TokenErrorFilter ~ status:', status);
    console.log(
      '🚀 ~ TokenErrorFilter ~ exception.message:',
      exception.message,
    );
    if (exception.message === 'invalid_grant') {
      response.redirect('/auth/google');
    }
    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: ctx.getRequest().url,
    });
    throw new Error('Method not implemented.');
  }
}
