import moment from 'moment';

import { PLUGIN_ID } from '../../admin/src/pluginId';
import defaultSettings from '../../admin/src/utils/defaultSettings';
import { SettingsType } from '../../types';

/**
 * Retrieves the plugin store for this plugin.
 */
export const getPluginStore = (): any => {
  return strapi.store({
    environment: '',
    type: 'plugin',
    name: PLUGIN_ID,
  });
};

/**
 * Creates the default plugin configuration in the store if not already set.
 */
export const createDefaultConfig = async (): Promise<SettingsType> => {
  const pluginStore = getPluginStore();
  await pluginStore.set({ key: 'settings', value: defaultSettings });
  return pluginStore.get({ key: 'settings' });
};

/**
 * Initializes the start and end handlers for retrieving data.
 * Handlers can be overridden by extensions if provided.
 *
 * @param {string} start - The start field identifier.
 * @param {string} end - The end field identifier.
 * @param {object} extensions - Registered extensions to override handlers.
 * @returns {[Function | undefined, Function | undefined]} Array containing startHandler and endHandler functions.
 */
export const initHandlers = (
  start: string,
  end: string,
  extensions: Record<string, any>
): [Function | undefined, Function | undefined] => {
  // Default start handler
  let startHandler: Function = async (
    startDate: string,
    endDate: string,
    strapi: any,
    config: SettingsType
  ) =>
    (
      await strapi.documents(config.collection).findMany({
        filters: {
          $and: [
            {
              [config.startField]: {
                $gte: moment(startDate).startOf('day').format(),
                $lte: moment(endDate).endOf('day').format(),
              },
            },
          ],
        },
      })
    ).reduce((acc: Record<string, any>, el: any) => {
      acc[el.id] = el;
      return acc;
    }, {});

  let endHandler: Function | undefined;

  // Override handlers if matching extension is found
  Object.entries(extensions).forEach(([id, extension]) => {
    if (id && start.startsWith(id)) {
      startHandler = extension.startHandler;
    }
    if (id && end.startsWith(id)) {
      endHandler = extension.endHandler;
    }
  });

  return [startHandler, endHandler];
};
