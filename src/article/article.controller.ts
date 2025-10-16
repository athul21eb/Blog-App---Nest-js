import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ArticleService } from './article.service';
import { AuthGuard } from '@/user/guards/auth.guard';
import { User } from '@/user/decorators/user.decorator';
import { CreateArticleDto } from '@/article/dto/createArticle.dto';
import { ArticleEntity } from '@/article/article.entity';
import { IArticleResponse } from '@/article/types/articleResponse.interface';
import { IsNotEmpty } from 'class-validator';
import { DeleteResult } from 'typeorm';
import { UpdateArticleDto } from '@/article/dto/updateArticle.dto';
import { IAllArticlesResponse } from '@/article/types/allArticlesResponse.interface';
import { UserEntity } from '@/user/user.entity';

@Controller('articles')
export class ArticleController {
  constructor(private readonly articleService: ArticleService) {}

  @Get()
  async findAllArticles(
    @User('id') currentUserId: string,
    @Query() query: any,
  ): Promise<IAllArticlesResponse> {
    return await this.articleService.findAllArticles(currentUserId, query);
  }

  @Get('feed')
  @UseGuards(AuthGuard)
  async getArticlesByFeed(
    @User('id') currentUserId: string,
    @Query() query: any,
  ): Promise<IAllArticlesResponse> {
    return await this.articleService.findAritlcesByFeed(currentUserId, query);
  }

  @Post()
  @UseGuards(AuthGuard)
  @UsePipes(new ValidationPipe())
  async createArticleController(
    @User() user,
    @Body('article') createArticleDto: CreateArticleDto,
  ): Promise<IArticleResponse> {
    const article = await this.articleService.createArticle(
      user,
      createArticleDto,
    );
    return this.articleService.getArticleResponse(article);
  }

  @Get(':slug')
  async getArticleUsingSlug(
    @Param('slug') slug: string,
  ): Promise<IArticleResponse> {
    if (typeof slug !== 'string' || !slug) {
      throw new HttpException(
        'slug must be valid string',
        HttpStatus.BAD_REQUEST,
      );
    }

    const article = await this.articleService.getSingleArticle(slug);

    return this.articleService.getArticleResponse(article);
  }

  @Put(':slug')
  @UseGuards(AuthGuard)
  @UsePipes(new ValidationPipe())
  async updateArticle(
    @Param('slug') slug: string,
    @Body('article') updateArticleDto: UpdateArticleDto,
    @User('id') currentUserId: string,
  ): Promise<IArticleResponse> {
    console.log(updateArticleDto);
    if (!updateArticleDto) {
      throw new BadRequestException('Cannot udpate without data !!! ');
    }
    const article = await this.articleService.updateArticle(
      slug,
      currentUserId,
      updateArticleDto,
    );
    return this.articleService.getArticleResponse(article);
  }

  @Delete(':slug')
  @UseGuards(AuthGuard)
  async deleteArticle(
    @Param('slug') slug: string,
    @User('id') currentUserId: string,
  ): Promise<DeleteResult> {
    return this.articleService.DeleteArticle(slug, currentUserId);
  }

  @Post(':slug/favorite')
  @UseGuards(AuthGuard)
  async addArticleToFavorites(
    @User('id') currentUserId: string,
    @Param('slug') slug: string,
  ): Promise<IArticleResponse> {
    return await this.articleService.addArticleToFavorties(currentUserId, slug);
  }

  @Delete(':slug/favorite')
  @UseGuards(AuthGuard)
  async removeArticleFromFavorites(
    @User('id') currentUserId: string,
    @Param('slug') slug: string,
  ): Promise<IArticleResponse> {
    return this.articleService.removeArticleFromFavortie(currentUserId, slug);
  }
}
