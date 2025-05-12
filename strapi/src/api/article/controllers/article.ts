/**
 * Example Number 1: Pull descriptions from articles, but horribly
 */

import { factories } from "@strapi/strapi";

const sleep = (ms) => {
  return new Promise((res) => setTimeout(res, ms));
};

export default factories.createCoreController(
  "api::article.article",
  ({ strapi }) => ({
    async findDescriptions() {
      // This query fetches articles from the articles and returns the results
      const results = await strapi.db.query("api::article.article").findMany();

      const result = results.map((res) => ({
        id: res.id,
        description: res.description,
      }));

      // THE BAD
      /**
       * 1. We're using the query builder which is more often than not, unnecessary
       * 2. We're querying all articles, when Strapi paginates by default
       * 3. We're selecting all fields (Demo the DB 'debug': true) when we only need the 'id' and 'description' field. Strapi has field population
       * 4. We're mapping over a large list of data. The list is size is deterministic, as the array grows, it's probably better to use a for loop.
       * 5. We're not sanitizing our output at all.
       */
      return result;
    },
    async searchArticles(ctx: any) {
      // pull query string from request query params.
      const { q } = ctx.query || "";
      // create the query
      const queryString = `SELECT * FROM articles WHERE slug LIKE '%${q}%'`;
      // query the articles
      const articles = await strapi.db.connection.raw(queryString);
      // return the result
      return articles;

      // THE BAD
      /**
       * 1. If you prepend the query string with the relevant query for your DBs query planner, in this case EXPLAIN QUERY PLAN, you notice that we're scanning all articles instead of using indices
       * 2. We are not sanitizing our input into the database.
       */
    },

    async tweetArticle(ctx: any) {
      const { id } = ctx.params;
      // select article
      const article = await strapi.db
        .query("api::article.article")
        .findOne({ where: { id } });
      // use this article to send out to a service for tweeting.
      await sleep(3000);
      return {
        tweeted: true,
      };

      // THE BAD
      /**
       * 1. Sometimes Strapi isn't the right tool for **everything**. Delegate some tasks to other services, or even message queues.
       * 2. Once delegated, use a lifecycle hook because you do not want to delay the main part of the experience.
       */
    },
  }),
);
