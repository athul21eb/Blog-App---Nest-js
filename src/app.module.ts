import { Module } from '@nestjs/common';

import { TypeOrmModule } from '@nestjs/typeorm';
import config from '@/ormconfig';
import { TagsModule } from '@/tags/tags.module';
import { AppController } from '@/app.controller';
import { AppService } from '@/app.service';
import { UserModule } from '@/user/user.module';
import { ConfigModule } from '@nestjs/config';



@Module({
  imports: [TypeOrmModule.forRoot(config),ConfigModule.forRoot({isGlobal:true}),TagsModule,UserModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
