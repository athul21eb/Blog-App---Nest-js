import { TagsEntity } from '@/tags/tags.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class TagsService {

  constructor(
    @InjectRepository(TagsEntity)
     private readonly tagsRepository:Repository<TagsEntity> ){}

  async getAllTags(){

    return await this.tagsRepository.find() ;
  }
}
