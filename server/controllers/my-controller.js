'use strict';

module.exports = {
  index(ctx) {
    ctx.body = strapi
      .plugin('calendar')
      .service('myService')
      .getWelcomeMessage();
  },
};
