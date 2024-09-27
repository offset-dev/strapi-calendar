import type { Core } from '@strapi/strapi';
import { PLUGIN_ID } from '../../../admin/src/pluginId';

const controller = ({ strapi }: { strapi: Core.Strapi }) => ({
  async getData(ctx) {
    ctx.body = await strapi
      .plugin(PLUGIN_ID)
      .service('service')
      .getData(ctx.query.start, ctx.query.end);
  },
  async getCollections(ctx) {
    try {
      ctx.body = await strapi.plugin(PLUGIN_ID).service('service').getCollections();
    } catch (err) {
      ctx.throw(500, err);
    }
  },
  async getExtensions(ctx) {
    try {
      ctx.body = await strapi.plugin(PLUGIN_ID).service('service').getExtensions();
    } catch (err) {
      ctx.throw(500, err);
    }
  },
  async getSettings(ctx) {
    try {
      ctx.body = await strapi.plugin(PLUGIN_ID).service('service').getSettings();
    } catch (err) {
      ctx.throw(500, err);
    }
  },
  async setSettings(ctx) {
    const { body } = ctx.request;
    try {
      await strapi.plugin(PLUGIN_ID).service('service').setSettings(body);
      ctx.body = await strapi.plugin(PLUGIN_ID).service('service').getSettings();
    } catch (err) {
      ctx.throw(500, err);
    }
  },
  async clearSettings(ctx) {
    try {
      await strapi.plugin(PLUGIN_ID).service('service').clearSettings();
      ctx.body = 'Settings have been reset';
    } catch (err) {
      ctx.throw(500, err);
    }
  },
});

export default controller;
