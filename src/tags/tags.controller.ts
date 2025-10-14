import { TagsService } from '@/tags/tags.service';
import { Controller, Get } from '@nestjs/common';

@Controller('tags')
export class TagsController {

  constructor(private readonly tagsService:TagsService){

  }

  @Get()
 async getAllTags(){

   const result = await this.tagsService.getAllTags()
   const tags: string[] = result.map(tag => tag.name);

   return {tags}


  }
}
