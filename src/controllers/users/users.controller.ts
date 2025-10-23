import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import { UsersService } from '../../services/users.service';
import { User } from '../../schemas/user.schema';
import { UpdateUserDto } from 'src/dto/update-user.dto';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/roles/roles.guard';
import { Roles } from 'src/roles/roles.decorator';
import { GetUsersFilterDto } from 'src/filters/get-user-filters.dto';
import { EmailService } from 'src/services/email.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService, private emailService: EmailService) {}

  @Get()
  async findAll(@Query() filterDto: GetUsersFilterDto): Promise<User[]> {
    return this.usersService.findAll(filterDto);
  }
  
  @Get(':email')
  async findOne(@Param('email') email: string): Promise<User | null> {
    return await this.usersService.findByEmail(email);
  }

  @Get(':id')
  async getUser(@Param('id') id: string): Promise<User> {
    return this.usersService.findById(id);
  }

  @Post('changePassword')
  async changePassword(@Body() { email }: { email: string }): Promise<boolean> {
    const u = await this.usersService.findByEmail(email);
    if(!u)
      return false;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const userId = (u as any)._id.toString();

    //INVIO EMAIL 
    const resetUrl = `${process.env.STATIC_PORTAL_URL}/authentication/reset-password?id=${userId}`;

    const body = `
      Gentile cliente, <br>
      Clicca qui sotto per recuperare la tua password: 
      <a href="${resetUrl}">Clicca qui</a>
    `;    

    const res = await this.emailService.sendEmailSendInBlue(email,"","Recupero password", body);

    return res;

  }

  @Post('changePasswordRequest')
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async changePasswordRequest(@Body() changePwd: any ): Promise<boolean> {
    const u = await this.usersService.findById(changePwd.id);
    if(!u)
      return false;

    //MODIFICA PASSWORD
    const password = changePwd.pwd;
    const dto: UpdateUserDto = {
      email:u.email,
      password:password,
      role:'admin'
    };

    const upd = await this.usersService.update(changePwd.id, dto);
    if(!upd)
      return false;

    return true;

  }

  @Put(':id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('admin')
  async updateUser(@Param('id') id: string, @Body() dto: UpdateUserDto): Promise<User | null> {
    return this.usersService.update(id, dto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('admin')
  async deleteUser(@Param('id') id: string): Promise<{ deleted: boolean }> {
    return this.usersService.remove(id);
  }
}
