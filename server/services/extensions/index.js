const extensionSystem = {
  extensions: {},
  getRegisteredExtensions() {
    return this.extensions;
  },
  registerExtension(id, name, startFields, endFields, startHandler, endHandler) {
    this.extensions[id] = {
      name,
      startFields,
      endFields,
      startHandler,
      endHandler,
    };
  },
  registerExtensions(extensions) {
    for (const e of extensions) {
      this.registerExtension(
        e.id,
        e.name,
        e.startFields,
        e.endFields,
        e.startHandler,
        e.endHandler
      );
    }
  },
  deregisterExtension(name) {
    delete this.extensions[name];
  },
};
module.exports = extensionSystem;
