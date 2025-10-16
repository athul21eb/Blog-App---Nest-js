import { forwardRef, Module } from '@nestjs/common';
import { ArticleService } from './article.service';
import { ArticleController } from './article.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ArticleEntity } from '@/article/article.entity';
import { UserModule } from '@/user/user.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([ArticleEntity]),
    forwardRef(() => UserModule),
  ],
  controllers: [ArticleController],
  providers: [ArticleService],
})
export class ArticleModule {}
