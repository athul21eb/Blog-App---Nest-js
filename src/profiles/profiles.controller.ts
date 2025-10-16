import { Controller, Get, Param } from '@nestjs/common';
import { ProfilesService } from './profiles.service';
import { User } from '@/user/decorators/user.decorator';

@Controller('profiles')
export class ProfilesController {
  constructor(private readonly profilesService: ProfilesService) {}

  @Get(':username')
  async getProfile(
    @User('id') currentUserId: string,
    @Param('username') username: string,
  ) {


    
  }
}
