'use strict';
const pluginId = require('../admin/src/pluginId');
const extensionSystem = require('./services/extensions');
module.exports = ({ strapi }) => {
  // bootstrap phase
  extensionSystem.registerExtensions(strapi.config.get(`plugin.${pluginId}.extensions`));
};
