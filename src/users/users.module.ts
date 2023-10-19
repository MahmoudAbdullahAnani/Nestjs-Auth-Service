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
import { EmailService } from './email.service';
import { ResetPasswordController, UpdatePasswordController, VerifyCodeController } from './controllers/auth/resetPassword.controller';
import { ResetPasswordService } from './services/auth/resetPassword.service';

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
    ResetPasswordController,
    VerifyCodeController,
    UpdatePasswordController,
  ],
  providers: [
    UsersService,
    UsersMeService,
    SignupService,
    SigninService,
    ResetPasswordService,
    EmailService,
  ],
})
export class UsersModule {}
