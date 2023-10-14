import {
  Controller,
  Get,
  Body,
  Patch,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { UsersMeService } from './usersMe.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersGuard } from './guards/users.guard';
import { Roles } from './guards/roles.decorator';

@Controller('me')
@UseGuards(UsersGuard)
export class UsersMeController {
  constructor(private readonly usersService: UsersMeService) {}
  @Roles(['admin', 'manger', 'user'])
  @Get()
  findOne(@Req() req: any) {
    return this.usersService.findOne(req);
  }

  @Roles(['admin', 'manger', 'user'])
  @Patch()
  update(@Req() req: any, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(req, updateUserDto);
  }

  @Roles(['admin', 'manger', 'user'])
  @Delete()
  remove(@Req() req: any) {
    return this.usersService.remove(req);
  }
}
