import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from './entities/user.entity';
// JWT
import { JwtModule } from '@nestjs/jwt';
import { UsersMeController } from './userMe.controller';
import { UsersMeService } from './usersMe.service';

const schema = [
  Users
]

@Module({
  imports: [
    TypeOrmModule.forFeature(schema),
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '60s' },
    }),
  ],
  controllers: [UsersController, UsersMeController],
  providers: [UsersService, UsersMeService],
})
export class UsersModule {}
