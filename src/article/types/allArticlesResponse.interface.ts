import { ArticleEntity } from "@/article/article.entity";



export interface IAllArticlesResponse {

  articles: ArticleEntity[],
  articlesCount :number
}