import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsInt, IsNotEmpty, IsNumber } from 'class-validator';

export class BaseEntity {
  @IsInt()
  @IsNumber()
  @ApiProperty({
    description: 'id of the entity is required',
    example: 1,
    examples: [1, 2, 3, 4],
    exclusiveMinimum: false,
  })
  id: number;

  @ApiProperty({
    title: 'Created At',
    description: 'The date and time when the entity was created.',
    example: '2021-05-15T09:00:00Z',
    examples: [
      '2021-05-15T09:00:00Z',
      '2024-11-26T09:00:00Z',
      '2029-07-02T09:00:00Z',
    ],
  })
  @IsDateString()
  @IsNotEmpty()
  createdAt: Date;

  @ApiProperty({
    title: 'Created At',
    description: 'The date and time when the entity was created.',
    example: '2021-05-15T09:00:00Z',
    examples: [
      '2021-05-15T09:00:00Z',
      '2024-11-26T09:00:00Z',
      '2029-07-02T09:00:00Z',
    ],
  })
  @IsDateString()
  @IsNotEmpty()
  updatedAt: Date;
}
