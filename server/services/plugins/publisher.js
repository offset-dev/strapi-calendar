const START_FIELD = "plugin::publisher:start";
const END_FIELD = "plugin::publisher:end";
const PLUGIN_CONTENT = "plugin::publisher.action";

const moment = require('moment');

module.exports = {
  base: "plugin::publisher",
  fields: [START_FIELD, END_FIELD],
  startFields: [{ id: START_FIELD, type: 'datetime', displayName: 'Publisher plugin start' }],
  endFields: [{ id: END_FIELD, type: 'datetime', displayName: 'Publisher plugin end' }],
  startHandler: async (date, entityService, config) => 
    (await entityService.findMany(PLUGIN_CONTENT, {
      filters: {
        entitySlug: { '$eq': config.collection },
        mode: { '$eq': config.startField === START_FIELD ? 'publish' : 'unpublish' },
        executeAt: {
          $gte: moment(date ?? moment()).startOf('month').subtract(1, 'month').format(),
          $lte: moment(date ?? moment()).endOf('month').add(1, 'month').format(),
        },
      }
    })).reduce((acc, el) => {
      acc[el.id] = {
        [config.startField]: el.executeAt
      }

      return acc
    }, {}),
  endHandler: async (ids, entityService, config) => 
  (await entityService.findMany(PLUGIN_CONTENT, {
    filters: {
      entitySlug: { '$eq': config.collection },
      mode: { '$eq': config.endField === END_FIELD ? 'unpublish' : 'publish' },
      entityId: { '$in': ids }
    }
  })).reduce((acc, el) => {
    acc[el.id] = {
      [config.endField]: el.executeAt
    }

    return acc
  }, {}),
}
