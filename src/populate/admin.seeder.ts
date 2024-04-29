import { Seeder } from 'nestjs-seeder';
import { PrismaClient, RoleEnum, UserStatus } from '@prisma/client';
import { UserService } from 'src/user/user.service';

const prisma = new PrismaClient();

export class AdminSeeder implements Seeder {
  constructor(private readonly userService: UserService) {}
  async seed() {
    await prisma.blog_user.create({
      data: {
        email: 'admin@gmail.com',
        name: 'John Doe',
        password: 'password123',
        address: '123 Main St',
        contact: '+1234567890',
        city: 'New York',
        country: 'USA',
        dob: '1990-01-01',
        postal: '10001',
        state: 'NY',
        role: RoleEnum.ADMIN,
        status: UserStatus.ACTIVE,
        deleted: false,
      },
    });
  }

  async drop() {
    await prisma.blog_user.delete({
      where: {
        email: 'admin@gmail.com',
      },
    });
  }
}
