import { Module } from '@nestjs/common';
import { UsersService } from './services/users.service';
import { UsersController } from './controllers/users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from './entities/user.entity';
// JWT
import { JwtModule } from '@nestjs/jwt';
import { UsersMeController } from './controllers/userMe.controller';
import { UsersMeService } from './services/usersMe.service';
import { SingupController } from './controllers/auth/sign-up.controller';
import { SignupService } from './services/auth/sign-up.service';
import { SinginController } from './controllers/auth/sign-in.controller';
import { SigninService } from './services/auth/sign-in.service';

const schema = [Users];

@Module({
  imports: [
    TypeOrmModule.forFeature(schema),
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '300s' },
    }),
  ],
  controllers: [
    UsersController,
    UsersMeController,
    SingupController,
    SinginController,
  ],
  providers: [UsersService, UsersMeService, SignupService, SigninService],
})
export class UsersModule {}
