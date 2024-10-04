'use strict';
const moment = require('moment');
const merge = require('deepmerge');
const extensionSystem = require('./extensions');

function getPluginStore() {
  return strapi.store({
    environment: '',
    type: 'plugin',
    name: 'calendar',
  });
}

function initHandlers(start, end, extensions) {
  // default handlers
  let startHandler = async (date, entityService, config) =>
    (
      await entityService.findMany(config.collection, {
        filters: {
          $and: [
            {
              [config.startField]: {
                $gte: moment(date).startOf('month').subtract(1, 'month').format(),
                $lte: moment(date).endOf('month').add(1, 'month').format(),
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

  // Extension handling
  Object.entries(extensions).map(([id, v]) => {
    if (id && start.startsWith(id)) {
      startHandler = v.startHandler;
    }
    if (id && end.startsWith(id)) {
      endHandler = v.endHandler;
    }
  });
  return [startHandler, endHandler];
}

async function createDefaultConfig() {
  const pluginStore = getPluginStore();
  await pluginStore.set({ key: 'settings', value: null });
  return pluginStore.get({ key: 'settings' });
}

module.exports = () => ({
  async getData(date = new Date()) {
    const pluginStore = getPluginStore();
    let config = await pluginStore.get({ key: 'settings' });
    if (!config) return [];

    const [startHandler, endHandler] = initHandlers(
      config.startField,
      config.endField,
      extensionSystem.getRegisteredExtensions()
    );
    let data = {};
    if (startHandler) {
      data = await startHandler(date, strapi.entityService, config);
    }
    if (endHandler) {
      data = merge(await endHandler(strapi.entityService, config, data), data);
    }

    const dataFiltered = Object.values(data).filter((x) => {
      if (config.drafts) return true;
      return x.publishedAt;
    });
    return dataFiltered.map((x) => {
      const startDate = moment(x[config.startField]).startOf('day').format(); 
      const endDate = config.endField ? moment(x[config.endField]).startOf('day').format() : null; 
      const isMultiDay = endDate && moment(endDate).isAfter(startDate);
      const startDateTime = startDate;
      const endDateTime = isMultiDay 
        ? moment(endDate).endOf('day').format() 
        : moment(startDate).add(config.defaultDuration, 'minutes').format();
      return {
        id: x.id,
        title: config.titleField ? x[config.titleField] : x[config.startField],
        startDate: startDateTime,
        endDate: endDateTime,
        color: config.colorField ? x[config.colorField] : null,
        allDay: isMultiDay, 
      };
    });
  },
  async getCollections() {
    const types = strapi.contentTypes;
    const typesArray = Object.values(types);
    return typesArray.filter((x) => x.kind === 'collectionType' && x.apiName);
  },
  async getExtensions() {
    return Object.entries(extensionSystem.getRegisteredExtensions()).map(([k, el]) => ({
      id: k,
      name: el.name,
      startFields: el.startFields,
      endFields: el.endFields,
    }));
  },
  async getSettings() {
    const pluginStore = getPluginStore();
    let config = await pluginStore.get({ key: 'settings' });
    if (!config) {
      config = await createDefaultConfig();
    }
    return config;
  },
  async setSettings(settings) {
    const value = settings;
    const pluginStore = getPluginStore();
    await pluginStore.set({ key: 'settings', value });
    return pluginStore.get({ key: 'settings' });
  },
});
