'use strict';
const moment = require('moment');

function getPluginStore() {
  return strapi.store({
    environment: '',
    type: 'plugin',
    name: 'calendar',
  });
}

async function createDefaultConfig() {
  const pluginStore = getPluginStore();
  await pluginStore.set({key: 'settings', value: null});
  return pluginStore.get({key: 'settings'});
}

module.exports = () => ({
  async getData(date) {
    const pluginStore = getPluginStore();
    let config = await pluginStore.get({key: 'settings'});
    if (!config) return [];

    const filters = {
      $and: [
        {
          [config.body.startField]: {
            $gte: moment(date ?? moment()).startOf('month').subtract(1, 'month').format(),
            $lte: moment(date ?? moment()).endOf('month').add(1, 'month').format(),
          },
        },
      ],
    };

    const data = await strapi.entityService.findMany(config.body.collection, {
      filters,
    });

    const dataFiltered = data.filter(x => {
      if (config.body.drafts) return true;
      return x.publishedAt;
    })

    return dataFiltered.map(x => ({
      id: x.id,
      title: config.body.titleField ? x[config.body.titleField] : config.body.startField,
      startDate: x[config.body.startField],
      endDate: config.body.endField ? x[config.body.endField] : moment(x[config.body.startField]).add(config.body.defaultDuration, "minutes"),
    }));
  },
  async getCollections() {
    const types = strapi.contentTypes;
    const typesArray = Object.values(types);
    const collections = typesArray.filter(x => x.kind === 'collectionType' && x.apiName);
    return collections;
  },
  async getSettings() {
    const pluginStore = getPluginStore();
    let config = await pluginStore.get({key: 'settings'});
    if (!config) {
      config = await createDefaultConfig();
    }
    return config;
  },
  async setSettings(settings) {
    const value = settings;
    const pluginStore = getPluginStore();
    await pluginStore.set({key: 'settings', value});
    return pluginStore.get({key: 'settings'});
  },
});
