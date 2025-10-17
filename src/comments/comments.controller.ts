import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { CommentsService } from './comments.service';
import { AuthGuard } from '@/user/guards/auth.guard';
import { User } from '@/user/decorators/user.decorator';
import { CreateCommentDto } from '@/comments/dto/createComment.dto';
import { ICommentResponse } from '@/comments/types/commentResponse.interface';
import { ICommentsResponse } from '@/comments/types/commentsResponse.interface';

@Controller('articles/:slug/comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}


  @Get()

  async getAllComments(
    @Param('slug') slug: string,
    @User("id") currentUserId:string
  ): Promise<ICommentsResponse> {
    return this.commentsService.getAllCommentsBySlug(slug,currentUserId);
  }

  @Post()
  @UseGuards(AuthGuard)
  @UsePipes(new ValidationPipe())
  async createComment(
    @User('id') currentUserId: string,
    @Param('slug') slug: string,
    @Body('comment') createCommentDto: CreateCommentDto,
  ): Promise<ICommentResponse> {
    return this.commentsService.createComment(
      currentUserId,
      slug,
      createCommentDto,
    );
  }

  @Delete(":id")
  
}
