import type { Core } from '@strapi/strapi';
import { PLUGIN_ID } from '../../admin/src/pluginId';

const bootstrap = ({ strapi }: { strapi: Core.Strapi }) => {
  // Register permission actions.
  const actions = [
    {
      section: 'plugins',
      displayName: 'Access the calendar page',
      uid: 'calendar.access',
      pluginName: PLUGIN_ID,
    },
    {
      section: 'plugins',
      displayName: 'Access the calendar settings',
      uid: 'calendar.settings.access',
      pluginName: PLUGIN_ID,
    },
  ];

  strapi.admin.services.permission.actionProvider.registerMany(actions);
};

export default bootstrap;
