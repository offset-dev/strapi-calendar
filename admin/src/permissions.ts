import { PLUGIN_ID } from './pluginId';

const pluginPermissions = {
  accessCalendar: [{ action: `plugin::${PLUGIN_ID}.calendar.access`, subject: null }],
  accessCalendarSettings: [
    { action: `plugin::${PLUGIN_ID}.calendar.settings.access`, subject: null },
  ],
};

export default pluginPermissions;
