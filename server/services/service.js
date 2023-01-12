"use strict";
const moment = require("moment");

function getPluginStore() {
  return strapi.store({
    environment: "",
    type: "plugin",
    name: "calendar",
  });
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

    const filters = {
      $and: [
        {
          [config.startField]: {
            $gte: moment(date).startOf('month').subtract(1, 'month').format(),
            $lte: moment(date).endOf('month').add(1, 'month').format(),
          },
        },
      ],
    };

    const data = await strapi.entityService.findMany(config.collection, {
      filters,
    });

    const dataFiltered = data.filter((x) => {
      if (config.drafts) return true;
      return x.publishedAt;
    });

    return dataFiltered.map((x) => ({
      id: x.id,
      title: config.titleField ? x[config.titleField] : config.startField,
      startDate: x[config.startField],
      endDate: config.endField ? x[config.endField] : moment(x[config.startField]).add(config.defaultDuration, "minutes"),
      color: config.colorField ? x[config.colorField] : null,
    }));
  },
  async getCollections() {
    const types = strapi.contentTypes;
    const typesArray = Object.values(types);
    return typesArray.filter(x => x.kind === 'collectionType' && x.apiName);
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
