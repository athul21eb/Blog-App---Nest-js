import { forwardRef, Module } from '@nestjs/common';
import { ProfilesService } from './profiles.service';
import { ProfilesController } from './profiles.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '@/user/user.entity';
import { FollowsEntity } from '@/profiles/follows.entity';
import { UserModule } from '@/user/user.module';

@Module({
  imports: [TypeOrmModule.forFeature([FollowsEntity]), UserModule],

  controllers: [ProfilesController],
  providers: [ProfilesService],
  exports:[ProfilesService]
})
export class ProfilesModule {}
