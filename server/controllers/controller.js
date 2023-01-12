"use strict";

module.exports = {
  async getData(ctx) {
    try {
      ctx.body = await strapi.plugin("calendar").service("service").getData(ctx.query.date);
    } catch (err) {
      ctx.throw(500, err);
    }
  },
  async getCollections(ctx) {
    try {
      ctx.body = await strapi.plugin("calendar").service("service").getCollections();
    } catch (err) {
      ctx.throw(500, err);
    }
  },
  async getSettings(ctx) {
    try {
      ctx.body = await strapi.plugin("calendar").service("service").getSettings();
    } catch (err) {
      ctx.throw(500, err);
    }
  },
  async setSettings(ctx) {
    const { body } = ctx.request;
    try {
      await strapi.plugin("calendar").service("service").setSettings(body);
      ctx.body = await strapi.plugin("calendar").service("service").getSettings();
    } catch (err) {
      ctx.throw(500, err);
    }
  },
};
