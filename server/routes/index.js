module.exports = [
  {
    method: "GET",
    path: "/",
    handler: "controller.getData",
    config: {
      policies: [],
      auth: false,
    },
  },
  {
    method: "GET",
    path: "/settings/collections",
    handler: "controller.getCollections",
    config: {
      policies: [],
      auth: false,
    },
  },
  {
    method: "GET",
    path: "/plugins",
    handler: "controller.getRelevantPlugins",
    config: {
      policies: [],
      auth: false,
    },
  },
  {
    method: "GET",
    path: "/settings",
    handler: "controller.getSettings",
    config: {
      policies: [],
      auth: false,
    },
  },
  {
    method: "POST",
    path: "/settings",
    handler: "controller.setSettings",
    config: {
      policies: [],
      auth: false,
    },
  },
];
