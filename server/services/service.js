"use strict";
const moment = require("moment");
const merge = require("deepmerge");
const plugins = require("./plugins");

function getPluginStore() {
  return strapi.store({
    environment: "",
    type: "plugin",
    name: "calendar",
  });
}

function initPluginIntegration(start, end) {
  let a;
  let b;
  // default handler (base)
  let startHandler = async (date, entityService, config) =>
    (
      await entityService.findMany(config.collection, {
        filters: {
          $and: [
            {
              [config.startField]: {
                $gte: moment(date)
                  .startOf("month")
                  .subtract(1, "month")
                  .format(),
                $lte: moment(date).endOf("month").add(1, "month").format(),
              },
            },
          ],
        },
      })
    ).reduce((acc, el) => {
      acc[el.id] = el;
      return acc;
    }, {});

  let endHandler;
  Object.entries(plugins).map(([k, v]) => {
    if (!a && v.base && start.startsWith(v.base)) {
      a = true;
      startHandler = v.startHandler;
    }
    if (!b && v.base && start.startsWith(v.base)) {
      b = true;
      endHandler = v.endHandler;
    }
  });
  return [a, b, startHandler, endHandler];
}

async function createDefaultConfig() {
  const pluginStore = getPluginStore();
  await pluginStore.set({ key: "settings", value: null });
  return pluginStore.get({ key: "settings" });
}

module.exports = () => ({
  async getData(date = new Date()) {
    const pluginStore = getPluginStore();
    let config = await pluginStore.get({ key: "settings" });
    if (!config) return [];

    const [isStartFieldPlugin, isEndFieldPlugin, startHandler, endHandler] =
      initPluginIntegration(config.startField, config.endField);
    let data = {};
    if (startHandler) {
      data = merge(
        data,
        await startHandler(date, strapi.entityService, config)
      );
    }

    // Fetch base fields
    const keys = Object.keys(data);
    if (isStartFieldPlugin && config.titleField) {
      data = merge(
        data,
        (
          await strapi.entityService.findMany(config.collection, {
            fields: [config.titleField],
            filters: { id: { $in: [...keys] } },
          })
        ).reduce((acc, el) => {
          acc[el.id] = el;
          return acc;
        }, {})
      );
    }
    if (endHandler) {
      data = merge(await endHandler(keys, strapi.entityService, config), data);
    }

    const dataFiltered = Object.values(data).filter((x) => {
      if (config.drafts) return true;
      return x.publishedAt;
    });

    return dataFiltered.map((x) => ({
      id: x.id,
      title: config.titleField ? x[config.titleField] : config.startField,
      startDate: x[config.startField],
      endDate: config.endField
        ? x[config.endField]
        : moment(x[config.startField]).add(config.defaultDuration, "minutes"),
      color: config.colorField ? x[config.colorField] : null,
    }));
  },
  async getCollections() {
    const types = strapi.contentTypes;
    const typesArray = Object.values(types);
    return typesArray.filter((x) => x.kind === "collectionType" && x.apiName);
  },
  async getRelevantPlugins() {
    const relevantPlugins = Object.entries(
      strapi.config.get("enabledPlugins") || {}
    )
      .filter(([k, v]) => v.enabled && Object.keys(plugins).includes(k))
      .map(([k, v]) => ({
        id: k,
        name: v.info.displayName,
        startFields: plugins[k].startFields,
        endFields: plugins[k].endFields,
      }));
    return relevantPlugins;
  },
  async getSettings() {
    const pluginStore = getPluginStore();
    let config = await pluginStore.get({ key: "settings" });
    if (!config) {
      config = await createDefaultConfig();
    }
    return config;
  },
  async setSettings(settings) {
    const value = settings;
    const pluginStore = getPluginStore();
    await pluginStore.set({ key: "settings", value });
    return pluginStore.get({ key: "settings" });
  },
});
