import { Controller, Post, Body, ValidationPipe } from '@nestjs/common';
import { ResetPasswordDto } from 'src/users/dto/auth.user.dto';
import { ResetPasswordService } from 'src/users/services/auth/resetPassword.service';

@Controller('resetPassword')
export class ResetPasswordController {
  constructor(private readonly ResetPassword: ResetPasswordService) {}

  @Post()
  ResetPasswordController(
    @Body(new ValidationPipe({ whitelist: true })) email: ResetPasswordDto,
  ): string {
    return this.ResetPassword.ResetPassword(email);
  }
}

// @Controller('VerifyCode')
// export class VerifyCodeController {
//     constructor(){}

//     @Post() {

//     }
// }
// @Controller('updatePassword')
// export class VerifyCodeController {
//     constructor(){}

//     @Post() {

//     }
// }
