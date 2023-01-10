const pluginPkg = require("../../package.json");

const pluginId = pluginPkg.strapi.name.replace(
  /^(@[^-,.][\w,-]+\/|strapi-)plugin-/i,
  ""
);

module.exports = pluginId;
