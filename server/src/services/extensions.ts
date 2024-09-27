import { ExtensionType, ExtensionsMapType } from '../../../types';

const extensionSystem = {
  extensions: {} as ExtensionsMapType,

  /**
   * Retrieves all registered extensions.
   *
   * @returns {ExtensionsMapType} The registered extensions.
   */
  getRegisteredExtensions: (): ExtensionsMapType => {
    return extensionSystem.extensions;
  },

  /**
   * Registers a single extension by its id and details.
   *
   * @param {string} id - The unique identifier for the extension.
   * @param {string} name - The name of the extension.
   * @param {string[]} startFields - The start fields handled by the extension.
   * @param {string[]} endFields - The end fields handled by the extension.
   * @param {Function} [startHandler] - Optional start handler function.
   * @param {Function} [endHandler] - Optional end handler function.
   */
  registerExtension: (
    id: string,
    name: string,
    startFields: string[],
    endFields: string[],
    startHandler?: Function,
    endHandler?: Function
  ): void => {
    extensionSystem.extensions[id] = {
      name,
      startFields,
      endFields,
      startHandler,
      endHandler,
    };
  },

  /**
   * Registers multiple extensions at once.
   *
   * @param {ExtensionType[]} extensions - The array of extensions to register.
   */
  registerExtensions: (extensions: ExtensionType[]): void => {
    extensions.forEach((extension: ExtensionType) => {
      extensionSystem.registerExtension(
        extension.id,
        extension.name,
        extension.startFields,
        extension.endFields,
        extension.startHandler,
        extension.endHandler
      );
    });
  },

  /**
   * Deregisters an extension by its name.
   *
   * @param {string} name - The name of the extension to remove.
   */
  deregisterExtension: (name: string): void => {
    delete extensionSystem.extensions[name];
  },
};

export default extensionSystem;
