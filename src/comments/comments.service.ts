import { ArticleService } from '@/article/article.service';
import { CommentsEntity } from '@/comments/comments.entity';
import { CreateCommentDto } from '@/comments/dto/createComment.dto';
import { ICommentResponse } from '@/comments/types/commentResponse.interface';
import { ICommentsResponse } from '@/comments/types/commentsResponse.interface';
import { ProfilesService } from '@/profiles/profiles.service';
import { UserEntity } from '@/user/user.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(CommentsEntity)
    private readonly commentsRepository: Repository<CommentsEntity>,
    private readonly articleService: ArticleService,
    private readonly profilService: ProfilesService,
  ) {}

  async getAllCommentsBySlug(
    slug: string,
    currentUserId: string,
  ): Promise<ICommentsResponse> {
    const comments = await this.commentsRepository.find({
      where: { article: { slug: slug } },

      select: {
        id: true,
        createdAt: true,
        updatedAt: true,
        body: true,
        author: {
          username: true,
          bio: true,
          image: true,
        },
      },
      order:{createdAt:"DESC"}
    });

    if (!comments.length) {
      return { comments: [] };
    }

    const followings =
      await this.profilService.findAllFollowings(currentUserId);

    const followingIds = followings.map((follow) => follow.followingId);

    const addedFollowingStatus_Comments = comments.map((comment) => {
      return {
        ...comment,
        following: followingIds.includes(comment.author?.id),
      };
    });

    return { comments: addedFollowingStatus_Comments } as ICommentsResponse;
  }

  async createComment(
    currentUserId: string,
    slug: string,
    comment: CreateCommentDto,
  ): Promise<ICommentResponse> {
    const article = await this.articleService.findArticleByslug(slug);

    const newComment = new CommentsEntity();

    Object.assign(newComment, comment);
    newComment.author = { id: currentUserId } as UserEntity;
    newComment.article = article;

    const savedComment = await this.commentsRepository.save(newComment);

    return this.generateCommentResponse(savedComment);
  }

  generateCommentResponse(comment: CommentsEntity): ICommentResponse {
    return {
      comment,
    };
  }
}
