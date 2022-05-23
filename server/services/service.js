'use strict';

function getPluginStore() {
  return strapi.store({
    environment: '',
    type: 'plugin',
    name: 'calendar',
  });
}

async function createDefaultConfig() {
  const pluginStore = getPluginStore();
  const value = {
    disabled: false,
  };
  await pluginStore.set({ key: 'settings', value });
  return pluginStore.get({ key: 'settings' });
}

module.exports = () => ({
  async getCollections() {
    const types = strapi.contentTypes;
    const typesArray = Object.values(types);
    const collections = typesArray.filter(x => x.kind === 'collectionType' && x.apiName);
    return collections;
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
