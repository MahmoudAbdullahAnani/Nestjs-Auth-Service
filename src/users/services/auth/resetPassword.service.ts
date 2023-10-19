import {
  HttpException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import {
  ResetPasswordDto,
  UpdatePasswordDto,
} from 'src/users/dto/auth.user.dto';
import { EmailService } from 'src/users/email.service';
import { Users } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Request } from 'express';
import { CreateUserDto } from 'src/users/dto/create-user.dto';

@Injectable()
export class ResetPasswordService {
  constructor(
    @InjectRepository(Users)
    private readonly usersRepository: Repository<Users>,
    private jwtService: JwtService,
    private readonly emailService: EmailService,
  ) {}

  async ResetPassword(
    body: ResetPasswordDto,
  ): Promise<{ status: string; message: string }> {
    // 1) get account in this is email, if not exist user on this is email throw error
    const user = await this.usersRepository.findOne({
      where: {
        email: body.email,
      },
    });

    if (!user) {
      throw new NotFoundException();
    }
    // 2) Create code example (854789)
    // Generate a verification code (a simple 6-digit code)
    const verificationCode = Math.floor(100000 + Math.random() * 900000);
    // 3) send code on this is email
    // console.log(email.email);

    try {
      await this.emailService.sendMail(
        process.env.USER,
        body.email,
        'Reset Password Veirfy Code',
        `This is Your Code ${verificationCode}`,
      );
      // Save verificationCode in DB
      const salt = await bcrypt.genSalt(10);
      const bcryptVerificationCode = await bcrypt.hash(
        `${verificationCode}`,
        salt,
      );
      await this.usersRepository.save({
        ...user,
        verificationCode: bcryptVerificationCode,
      });
    } catch (error) {
      console.error('Error sending email:', error);

      throw new HttpException('Failed to send email', 500);
    }

    return {
      status: 'success',
      message: `The password reset code has been sent to ${body.email}`,
    };
  }

  async verifyCode(
    code: string | Buffer,
    req: Request,
  ): Promise<{ status: string; message: string }> {
    // 1) get account in this is email, if not exist user on this is email throw error
    const token = req.headers.authorization.split(' ', 2)[1];

    if (!token) {
      throw new UnauthorizedException();
    }
    const id = this.jwtService.verify(token, {
      secret: process.env.JWT_SECRET,
    }).id;

    const user = await this.usersRepository.findOne({
      where: {
        id,
      },
    });

    if (!user) {
      throw new NotFoundException();
    }
    // verify code, if matching update password else res error field code verify

    const isPassword = await bcrypt.compare(
      code.toString(),
      user.verificationCode.toString(),
    );

    if (!isPassword) {
      throw new HttpException('Incorrect code', 500);
    }

    return {
      status: 'success',
      message: `Update Password Now`,
    };
  }

  async UpdatePassword(body: UpdatePasswordDto, req: Request): Promise<CreateUserDto> {
    // 1) get account in this is email, if not exist user on this is email throw error
    
    const token = req.headers.authorization.split(' ', 2)[1];

    if (!token) {
      throw new UnauthorizedException();
    }
    const id = this.jwtService.verify(token, {
      secret: process.env.JWT_SECRET,
    }).id;

    const user = await this.usersRepository.findOne({
      where: {
        id,
      },
    });

    if (!user) {
      throw new NotFoundException();
    }
    // verify code, if matching update password else res error field code verify
    const password = body.password;
    const confirmPassword = body.confirmPassword;
    if (password !== confirmPassword) {
      throw new HttpException('Passwords do not match', 500);
    }
    const salt = await bcrypt.genSalt(10);
    const bcryptPassword = await bcrypt.hash(password, salt);
    await this.usersRepository.save({
      ...user,
      password: bcryptPassword,
      verificationCode:"",
    });
    return user;
  }
}
