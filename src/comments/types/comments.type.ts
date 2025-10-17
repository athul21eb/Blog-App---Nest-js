import { CommentsEntity } from "@/comments/comments.entity";



export type CommentType = Omit<CommentsEntity,"changeUpdateAt"> & {following:boolean}