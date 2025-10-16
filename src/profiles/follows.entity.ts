import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";




@Entity({name:"follows"})
export class FollowsEntity {

  @PrimaryGeneratedColumn("uuid")
  id:string

  @Column()
  followerId:string

  @Column()
  followingId:string
}