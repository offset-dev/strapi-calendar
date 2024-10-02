import type { Core } from '@strapi/strapi';
import moment from 'moment';
import merge from 'deepmerge';
import extensionSystem from './extensions';

import { createDefaultConfig, getPluginStore, initHandlers } from '../utils';
import { SettingsType } from '../../../types';

const service = ({ strapi }: { strapi: Core.Strapi }) => ({
  getData: async (start: string, end: string): Promise<any[]> => {
    const pluginStore = getPluginStore();
    let config: SettingsType | null = await pluginStore.get({ key: 'settings' });
    if (!config) return [];

    const [startHandler, endHandler] = initHandlers(
      config.startField,
      config.endField,
      extensionSystem.getRegisteredExtensions()
    );

    let data: Record<string, any> = {};
    if (startHandler) {
      data = await startHandler(start, end, strapi, config);
    }
    if (endHandler) {
      data = merge(await endHandler(strapi, config, data), data);
    }

    // Filter out drafts if not configured to show them
    const dataFiltered = Object.values(data).filter((x) => {
      if (config.drafts) return true;
      return x.publishedAt;
    });

    // Map data into the required format
    return dataFiltered.map((x) => ({
      id: x.documentId,
      title: config.titleField ? x[config.titleField] : config.startField,
      start: x[config.startField],
      end: config.endField
        ? x[config.endField]
        : moment(x[config.startField]).add(config.defaultDuration, 'minutes'),
      backgroundColor:
        config.colorField && x[config.colorField] ? x[config.colorField] : config.eventColor,
      borderColor:
        config.colorField && x[config.colorField] ? x[config.colorField] : config.eventColor,
      url: `/admin/content-manager/collection-types/${config.collection}/${x.documentId}`,
    }));
  },

  /**
   * Retrieves all content types that are collection types.
   */
  getCollections: async (): Promise<any[]> => {
    const types = strapi.contentTypes;
    return Object.values(types).filter((type) => type.kind === 'collectionType' && type.apiName);
  },

  /**
   * Retrieves all registered extensions.
   */
  getExtensions: async (): Promise<any[]> => {
    return Object.entries(extensionSystem.getRegisteredExtensions()).map(([id, extension]) => ({
      id,
      name: extension.name,
      startFields: extension.startFields,
      endFields: extension.endFields,
    }));
  },

  /**
   * Retrieves the current settings from the plugin store, or creates default settings if none exist.
   */
  getSettings: async (): Promise<SettingsType> => {
    const pluginStore = getPluginStore();
    let config = await pluginStore.get({ key: 'settings' });
    if (!config) {
      config = await createDefaultConfig();
    }
    return config;
  },

  /**
   * Saves the provided settings to the plugin store.
   */
  setSettings: async (settings: SettingsType): Promise<SettingsType> => {
    const pluginStore = getPluginStore();
    await pluginStore.set({ key: 'settings', value: settings });
    return pluginStore.get({ key: 'settings' });
  },

  /**
   * Clears the current settings from the plugin store.
   */
  clearSettings: async (): Promise<SettingsType> => {
    const pluginStore = getPluginStore();
    await pluginStore.set({ key: 'settings', value: null });
    return pluginStore.get({ key: 'settings' });
  },
});

export default service;
