import {
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ProfilesService } from './profiles.service';
import { User } from '@/user/decorators/user.decorator';
import { IProfileResponse } from '@/profiles/types/profileResponse.interface';
import { AuthGuard } from '@/user/guards/auth.guard';

@Controller('profiles')
export class ProfilesController {
  constructor(private readonly profilesService: ProfilesService) {}

  @Get(':username')
  async getProfile(
    @Param('username') username: string,
    @User('id') currentUseId: string,
  ): Promise<IProfileResponse> {
    const profile = await this.profilesService.getProfile(
      username,
      currentUseId,
    );

    return this.profilesService.generateProfileResponse(profile);
  }

  @Post(':username/follow')
  @UseGuards(AuthGuard)
  async followProfile(
    @User('id') currentUserId: string,
    @Param('username') username: string,
  ): Promise<IProfileResponse> {
    const followingProfile = await this.profilesService.followProfile(
      currentUserId,
      username,
    );

    return this.profilesService.generateProfileResponse(followingProfile);
  }

  @Delete(':username/follow')
  @UseGuards(AuthGuard)
  async unfollowProfile(
    @User('id') currentUserId: string,
    @Param('username') username: string,
  ): Promise<IProfileResponse> {
    const unfollowingProfile = await this.profilesService.unfollowProfile(
      currentUserId,
      username,
    );

    return this.profilesService.generateProfileResponse(unfollowingProfile);
  }
}
