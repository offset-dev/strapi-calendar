const pluginPkg = require('../../package.json');

const pluginId = pluginPkg.strapi.displayName.replace(/^(@[^-,.][\w,-]+\/|strapi-)plugin-/i, '');

module.exports = pluginId;
