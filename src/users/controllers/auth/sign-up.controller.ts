import {
  Controller,
  Body,
  UseGuards,
  Post,
  ValidationPipe,
} from '@nestjs/common';
import { UsersGuard } from '../../guards/users.guard';
import { Roles } from '../../guards/roles.decorator';
import { SignupService } from 'src/users/services/auth/sign-up.service';
import { CreateUserSingUpDto } from 'src/users/dto/create-user.dto';

@Controller('signup')
// @UseGuards(UsersGuard)
export class SingupController {
  constructor(private readonly signupService: SignupService) {}
  // @Roles(['admin', 'manger', 'user'])
  @Post()
  signup(
    @Body(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
    createUserDto: CreateUserSingUpDto,
  ): Promise<{ data: CreateUserSingUpDto; token: string }> {
    return this.signupService.signup(createUserDto);
  }
}
