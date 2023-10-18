import { Injectable, NotFoundException, HttpException } from '@nestjs/common';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from '../entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(Users)
    private readonly usersRepository: Repository<Users>,
  ) {}
  async create(createUserDto: CreateUserDto): Promise<CreateUserDto> {
    // if this is data of user exist==> throw error this is user exist
    const user = await this.usersRepository.findOne({
      where: {
        userName: createUserDto.userName,
        password: createUserDto.password,
      },
    });
    if (user) {
      throw new HttpException(
        'The user is already exist, go to update field active true',
        400,
      );
    }

    // if this is data of user not exist==> Create New User
    const newUser = await this.usersRepository.create(createUserDto);
    return this.usersRepository.save({ ...newUser, active: true });
  }

  async findAll(): Promise<CreateUserDto[]> {
    return await this.usersRepository.find();
  }

  async findOne(id: string): Promise<CreateUserDto> {
    const user = await this.usersRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException();
    }
    return user;
  }

  async update(
    id: string,
    updateUserDto: UpdateUserDto,
  ): Promise<UpdateUserDto> {
    const user = await this.findOne(id);
    return await this.usersRepository.save({ ...user, ...updateUserDto });
  }

  async remove(id: string): Promise<void> {
    await this.usersRepository.delete(id);
  }
}
