import {
  Injectable,
  Req,
  UnauthorizedException,
  NotFoundException,
  HttpException,
} from '@nestjs/common';
import { CreateUserDto, CreateUserSingUpDto } from '../../dto/create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from '../../entities/user.entity';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { Login } from 'src/users/dto/auth.user.dto';

@Injectable()
export class SigninService {
  constructor(
    @InjectRepository(Users)
    private readonly usersRepository: Repository<Users>,
    private jwtService: JwtService,
  ) {}
  async signin(login: Login): Promise<{ data: CreateUserDto; token: string }> {
    const user = await this.usersRepository.findOne({
      where: {
        userName: login.userName,
        password: login.password,
      },
    });
    // User exist
    if (!user) {
      throw new HttpException('Incorrect Data', 400);
    }
    // check if user notactive then=> active this is user
    if (!user.active) {
      await this.usersRepository.save({ ...user, active: true });
    }
    // Create Token login ===> encoded
    const payload: { id: string; userName: string; role: string } = {
      id: user.id,
      userName: user.userName,
      role: user.role,
    };
    const token = await this.jwtService.signAsync(payload, {
      secret: process.env.JWT_SECRET,
    });

    return { token, data: { ...user, active: true } };
  }
}
