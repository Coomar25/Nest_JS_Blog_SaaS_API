import { seeder } from 'nestjs-seeder';
import { AdminSeeder } from './admin.seeder';

seeder({
  imports: [],
  providers: [],
}).run([AdminSeeder]);
