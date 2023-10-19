import {
  Injectable,
  Req,
  UnauthorizedException,
  NotFoundException,
  HttpException,
} from '@nestjs/common';
import { CreateUserSingUpDto } from '../../dto/create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from '../../entities/user.entity';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import bcrypt from 'bcrypt';
@Injectable()
export class SignupService {
  constructor(
    @InjectRepository(Users)
    private readonly usersRepository: Repository<Users>,
    private jwtService: JwtService,
  ) {}
  async signup(
    createUserDto: CreateUserSingUpDto,
  ): Promise<{ data: CreateUserSingUpDto; token: string }> {
    const user = await this.usersRepository.findOne({
      where: {
        userName: createUserDto.userName,
      },
    });

    // User exist
    if (user) {
      if (user.active === true) {
        throw new HttpException('The user is already exist, go to login', 400);
      } else {
        throw new HttpException(
          'Your account is not activated. Log in again if you want to activate it',
          400,
        );
      }
    }

    // Create User
    // Hashing Password
    // Save verificationCode in DB
    const salt = await bcrypt.genSalt(10);
    const password = await bcrypt.hash(createUserDto.password, salt);
    const newUser = await this.usersRepository.create({
      ...createUserDto,
      password,
    });
    const newUserData = await this.usersRepository.save({
      ...newUser,
      role: 'user',
      active: true,
    });

    const payload = {
      id: newUserData.id,
      username: newUserData.userName,
      role: newUserData.role,
    };
    const token = await this.jwtService.signAsync(payload, {
      secret: process.env.JWT_SECRET,
    });

    return { token, data: newUser };
  }
}
