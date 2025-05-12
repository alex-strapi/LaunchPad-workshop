import { Core } from "@strapi/strapi";

export default {
  routes: [
    {
      path: "/articles/findDescriptions",
      method: "GET",
      handler: "article.findDescriptions",
    },
    {
      path: "/articles/searchArticles",
      method: "GET",
      handler: "article.searchArticles",
    },
    {
      path: "/articles/:id/tweetArticle",
      method: "GET",
      handler: "article.tweetArticle",
    },
  ],
};
