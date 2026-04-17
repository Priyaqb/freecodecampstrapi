function toSlug(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

export default {
  async beforeCreate(event) {
    const { data } = event.params;

    strapi.log.info('beforeCreate data keys: ' + JSON.stringify(Object.keys(data)));
    strapi.log.info('beforeCreate data: ' + JSON.stringify(data));

    if (data.blogtitle && !data.slug) {
      data.slug = toSlug(data.blogtitle);
    } else if (data.slug) {
      data.slug = toSlug(data.slug);
    }
  },

  beforeUpdate(event) {
    const { data } = event.params;
    if (data.slug) {
      data.slug = toSlug(data.slug);
    } else if (data.blogtitle) {
      data.slug = toSlug(data.blogtitle);
    }
  },
};
