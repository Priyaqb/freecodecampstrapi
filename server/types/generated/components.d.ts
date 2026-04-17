import type { Schema, Struct } from '@strapi/strapi';

export interface BannerHeroBlogBanner extends Struct.ComponentSchema {
  collectionName: 'components_banner_hero_blog_banners';
  info: {
    displayName: 'Hero blog banner';
  };
  attributes: {
    authors: Schema.Attribute.Relation<'oneToMany', 'api::author.author'>;
    blogpublishingdate: Schema.Attribute.DateTime;
    thumbnail: Schema.Attribute.Media<'images', true>;
    timetoread: Schema.Attribute.String;
    Title: Schema.Attribute.String;
  };
}

declare module '@strapi/strapi' {
  export module Public {
    export interface ComponentSchemas {
      'banner.hero-blog-banner': BannerHeroBlogBanner;
    }
  }
}
