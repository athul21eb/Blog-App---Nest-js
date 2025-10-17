import { Module } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CommentsController } from './comments.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommentsEntity } from '@/comments/comments.entity';
import { ArticleModule } from '@/article/article.module';
import { ProfilesModule } from '@/profiles/profiles.module';

@Module({
  imports:[TypeOrmModule.forFeature([CommentsEntity]),ArticleModule,ProfilesModule],
  controllers: [CommentsController],
  providers: [CommentsService],
})
export class CommentsModule {}
