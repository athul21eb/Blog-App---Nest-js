import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";



@Entity({name:"tags"})
export class TagsEntity{

  @PrimaryGeneratedColumn("increment")
  id:number

  @Column()
  name:string
  
  @CreateDateColumn({type:"timestamp"})
  createdAt:string;
}