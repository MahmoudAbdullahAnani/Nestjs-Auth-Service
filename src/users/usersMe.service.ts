import { Injectable, Req, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from './entities/user.entity';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UsersMeService {
  constructor(
    @InjectRepository(Users)
    private readonly usersRepository: Repository<Users>,
    private jwtService: JwtService,
  ) {}
  async findOne(req: any): Promise<CreateUserDto> {
    const token = req.headers?.authorization.split(' ')[1];

    if (!token) {
      throw new UnauthorizedException();
    }
    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: process.env.JWT_SECRET,
      });
      return await this.usersRepository.findOne({ where: { id: payload.id } });
    } catch {
      throw new UnauthorizedException();
    }
  }

  async update(req: any, updateUserDto: UpdateUserDto): Promise<UpdateUserDto> {
    const token = req.headers?.authorization.split(' ')[1];
    
    if (!token) {
      throw new UnauthorizedException();
    }
    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: process.env.JWT_SECRET,
      });
      const user = await this.findOne(req);
      
      return await this.usersRepository.save({ ...user, ...updateUserDto });
    } catch {
      throw new UnauthorizedException();
    }
  }

  async remove(req: any): Promise<void> {
    const token = req.headers.authorization.split(' ', 2)[1];

    if (!token) {
      throw new UnauthorizedException();
    }
    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: process.env.JWT_SECRET,
      });
      const user = await this.findOne(req);
      await this.usersRepository.save({ ...user, active: false });
    } catch {
      throw new UnauthorizedException();
    }
  }
}
