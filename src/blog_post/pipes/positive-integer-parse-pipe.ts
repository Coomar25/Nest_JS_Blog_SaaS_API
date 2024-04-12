import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';
import { validate } from 'class-validator';
import { IDParamDto } from '../dto/update-blog_post.dto';
import { plainToClass } from 'class-transformer';

@Injectable()
export class ParsePositiveIntPipe implements PipeTransform {
  async transform(value: string) {
    const obj = plainToClass(IDParamDto, { id: parseInt(value) });
    const errors = await validate(obj);
    if (errors.length > 0) {
      throw new BadRequestException('ID must be a positive integer.');
    }
    return obj.id;
  }
}
