/**
 * blog-page middleware
 * Populates Banner component with thumbnail and authors for both listing and detail
 */

import type { Core } from '@strapi/strapi';

export default (_config: unknown, _ctx: { strapi: Core.Strapi }) => {
  return async (ctx: any, next: () => Promise<void>) => {
    // Only set populate if not already provided by the client
    if (!ctx.query.populate) {
      ctx.query.populate = {
        featuredimage: true,
        Banner: {
          populate: {
            thumbnail: true,
            authors: {
              populate: ['authorpic'],
            },
          },
        },
      };
    }

    await next();
  };
};
