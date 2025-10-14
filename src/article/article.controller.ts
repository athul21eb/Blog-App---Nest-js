import {
  Body,
  Controller,
  Post,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ArticleService } from './article.service';
import { AuthGuard } from '@/user/guards/auth.guard';
import { User } from '@/user/decorators/user.decorator';
import { CreateArticleDto } from '@/article/dto/createArticle.dto';
import { ArticleEntity } from '@/article/article.entity';

@Controller('article')
export class ArticleController {
  constructor(private readonly articleService: ArticleService) {}

  @Post()
  @UseGuards(AuthGuard)
  @UsePipes(new ValidationPipe())
  async createArticleController(
    @User() user,
    @Body('article') createArticleDto: CreateArticleDto,
  ): Promise<ArticleEntity> {
    return await this.articleService.createArticle(user, createArticleDto);
  }
}
