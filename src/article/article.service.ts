import { ArticleEntity } from '@/article/article.entity';
import { CreateArticleDto } from '@/article/dto/createArticle.dto';
import { UpdateArticleDto } from '@/article/dto/updateArticle.dto';
import { IAllArticlesResponse } from '@/article/types/allArticlesResponse.interface';
import { IArticleResponse } from '@/article/types/articleResponse.interface';
import { UserEntity } from '@/user/user.entity';
import { UserService } from '@/user/user.service';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import slugify from 'slugify';
import { DeleteResult, Repository } from 'typeorm';
import { QueryBuilder } from 'typeorm/browser';

@Injectable()
export class ArticleService {
  constructor(
    @InjectRepository(ArticleEntity)
    private readonly articleRepository: Repository<ArticleEntity>,

    private readonly userService: UserService,
  ) {}

  async findAllArticles(
    currentUserId: string,
    query: any,
  ): Promise<IAllArticlesResponse> {
    const queryBuilder = this.articleRepository
      .createQueryBuilder('articles')
      .leftJoinAndSelect('articles.author', 'author');
    if (query.tag) {
      queryBuilder.andWhere('articles.tagList LIKE :tag', {
        tag: `%${query.tag}%`,
      });
    }

    if (query.author) {
      const author = await this.userService.userFindByUsername(query.author);

      if (author) {
        queryBuilder.andWhere('articles.authorId = :id', {
          id: author.id,
        });
      } else {
        return { articles: [], articlesCount: 0 };
      }
    }

    if (query.favorite) {
      console.log(query.favorite);
      const user = await this.userService.userFindByUsername(query.favorite);
      if (!user?.favorites || user.favorites.length === 0) {
        return { articles: [], articlesCount: 0 };
      } else {
        const favoritesIds = user.favorites.map((articles) => articles.id);

        queryBuilder.andWhere('articles.id  IN  (:...ids)', {
          ids: favoritesIds,
        });
      }
    }

    if (query.limit) {
      queryBuilder.limit(+query.limit);
    }

    if (query.offset) {
      queryBuilder.offset(+query.offset);
    }

    queryBuilder.orderBy('articles.createdAt', 'DESC');

    const articles = await queryBuilder.getMany();
    const articlesCount = await queryBuilder.getCount();

    let favoritedIds: string[] = [];
    if (currentUserId) {

      const currentUser = await this.userService.userFindById(currentUserId)

      favoritedIds = currentUser.favorites.map((article) => article.id);
    }
    articles.forEach((article) => {
      if (favoritedIds.includes(article.id)) {
        article.favorited = true;
      }
    });
    return { articles, articlesCount };
  }

  async createArticle(
    user: UserEntity,
    createArticleDto: CreateArticleDto,
  ): Promise<ArticleEntity> {
    const article = new ArticleEntity();

    Object.assign(article, createArticleDto);

    article.slug = this.generateStringSlugify(article.title);

    article.author = user;

    return this.articleRepository.save(article);
  }

  async updateArticle(
    slug: string,
    currentUserId: string,
    updateArticleDto: UpdateArticleDto,
  ): Promise<ArticleEntity> {
    const article = await this.findArticleByslug(slug);

    if (article.author.id !== currentUserId) {
      throw new HttpException(
        "You are not an author. You can't udpate this article",
        HttpStatus.FORBIDDEN,
      );
    }

    if (updateArticleDto?.title) {
      article.slug = this.generateStringSlugify(updateArticleDto.title);
    }

    return this.articleRepository.save(article);
  }

  async DeleteArticle(
    slug: string,
    currentUserId: string,
  ): Promise<DeleteResult> {
    const article = await this.findArticleByslug(slug);

    if (article.author.id !== currentUserId) {
      throw new HttpException(
        "You are not an Author . You can't delete this article !!",
        HttpStatus.FORBIDDEN,
      );
    }

    return this.articleRepository.delete({ slug });
  }

  generateStringSlugify(title: string): string {
    const id = Date.now().toString(36) + Math.random().toString(36).slice(2);
    return `${slugify(title, { lower: true })}-${id}`;
  }
  async getArticleResponse(article: ArticleEntity): Promise<IArticleResponse> {
    if (article?.author) {
      delete article.author.password;
    }
    return {
      article,
    };
  }

  async getSingleArticle(slug: string): Promise<ArticleEntity> {
    const article = await this.findArticleByslug(slug);
    return article;
  }

  async findArticleByslug(slug: string): Promise<ArticleEntity> {
    const article = await this.articleRepository.findOne({
      where: { slug },
      relations: ['author'],
    });
    if (!article) {
      throw new HttpException('article not found', HttpStatus.NOT_FOUND);
    }

    return article;
  }

  async addArticleToFavorties(
    currentUserId: string,
    slug: string,
  ): Promise<IArticleResponse> {
    const user = await this.userService.userFindById(currentUserId);

    const currentArticle = await this.findArticleByslug(slug);

    const isNotFavorite = user.favorites.find(
      (article) => article.slug === slug,
    );

    if (!isNotFavorite) {
      user.favorites.push(currentArticle);
      currentArticle.favoritesCount++;
      await this.articleRepository.save(currentArticle);
      await this.userService.saveUser(user);
    }

    return this.getArticleResponse(currentArticle);
  }

  async removeArticleFromFavortie(
    currentUserId: string,
    slug: string,
  ): Promise<IArticleResponse> {
    const user = await this.userService.userFindById(currentUserId);
    const currentArticle = await this.findArticleByslug(slug);

    const isFavortie = user.favorites.find((article) => article.slug === slug);

    if (isFavortie) {
      user.favorites = user.favorites.filter(
        (article) => article.id !== currentArticle.id,
      );
      currentArticle.favoritesCount--;
      await this.articleRepository.save(currentArticle);
      await this.userService.saveUser(user);
    }
    return this.getArticleResponse(currentArticle);
  }
}
