import { FollowsEntity } from '@/profiles/follows.entity';
import { ProfileType } from '@/profiles/types/profile.type';
import { IProfileResponse } from '@/profiles/types/profileResponse.interface';
import { UserEntity } from '@/user/user.entity';
import { UserService } from '@/user/user.service';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class ProfilesService {
  constructor(
    @InjectRepository(FollowsEntity)
    private readonly followRepository: Repository<FollowsEntity>,
    private readonly userService: UserService,
  ) {}

  async findAllFollowings(currentUserId: string): Promise<FollowsEntity[]> {
    return await this.followRepository.find({
      where: { followerId: currentUserId },
    });
  }
  async isFollowedCheck(
    followerId: string,
    followingProfileId: string,
  ): Promise<FollowsEntity | null> {
    const follow = await this.followRepository.findOne({
      where: { followerId: followerId, followingId: followingProfileId },
    });

    if (!follow) {
      return null;
    }

    return follow;
  }

  async getProfile(
    followingProfileName: string,
    currentUseId: string,
  ): Promise<ProfileType> {
    const profile = await this.userService.userFindByUsername(
      followingProfileName,
      false,
    );

    if (!profile) {
      throw new HttpException('Profile is not Found', HttpStatus.NOT_FOUND);
    }
    let isFollowed = false;

    if (currentUseId) {
      const follow = await this.isFollowedCheck(currentUseId, profile.id);
      isFollowed = Boolean(follow);
    }

    return {
      ...profile,
      following: isFollowed,
    };
  }

  async unfollowProfile(
    currentUserId: string,
    followingProfileName: string,
  ): Promise<ProfileType> {
    const followingProfile =
      await this.userService.userFindByUsername(followingProfileName);

    if (!followingProfile) {
      throw new HttpException(
        'Following Profile is Not Found',
        HttpStatus.NOT_FOUND,
      );
    }

    const isFollowed = await this.isFollowedCheck(
      currentUserId,
      followingProfile.id,
    );

    if (isFollowed) {
      await this.followRepository.delete({ id: isFollowed.id });
    }

    return { ...followingProfile, following: false };
  }

  async followProfile(
    currentUserId: string,
    followingProfileName: string,
  ): Promise<ProfileType> {
    const followingProfile = await this.userService.userFindByUsername(
      followingProfileName,
      false,
    );

    if (!followingProfile) {
      throw new HttpException(
        'Following Profile is not Found',
        HttpStatus.NOT_FOUND,
      );
    }

    if (followingProfile.id === currentUserId) {
      throw new HttpException(
        `You can't  follow yourSelf !`,
        HttpStatus.BAD_REQUEST,
      );
    }

    const isFollowed = await this.isFollowedCheck(
      currentUserId,
      followingProfile.id,
    );

    if (!isFollowed) {
      const newFollows = new FollowsEntity();
      ((newFollows.followerId = currentUserId),
        (newFollows.followingId = followingProfile.id));

      await this.followRepository.save(newFollows);
    }

    return { ...followingProfile, following: true };
  }
  async generateProfileResponse(
    profile: ProfileType,
  ): Promise<IProfileResponse> {
    return {
      profile: {
        username: profile.username,
        bio: profile.bio,
        image: profile.image,
        following: profile.following,
      },
    };
  }
}
