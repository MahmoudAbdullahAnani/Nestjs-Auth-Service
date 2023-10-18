import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { ResetPasswordDto } from 'src/users/dto/auth.user.dto';
import { Users } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ResetPasswordService {
  constructor(
    @InjectRepository(Users)
    private readonly usersRepository: Repository<Users>,
    private jwtService: JwtService,
  ) {}

  ResetPassword(email: ResetPasswordDto): any {
    /*
        1) get account in this is email, if not exist user on this is email throw error
        2) Create code example (5487)
        3) send code on this is email
      */
    return email;
  }
  verifyCode(): string {
    return 'verifyCode';
  }
  UpdatePassword(): string {
    return 'UpdatePassword';
  }
}
