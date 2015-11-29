'use strict'

const _ = require('lodash')
const lib = require('./')

module.exports = {

  /**
   * Aggregate and combine footprint routes from Model actions and Controller
   * handlers
   */
  buildFootprintRoutes (config, api) {
    let modelFootprintRoutes = lib.Footprints.getModelRoutes(config)
    let controllerFootprintRoutes = lib.Footprints.getControllerRoutes(config, api)
    return  _.union(modelFootprintRoutes, controllerFootprintRoutes)
  },

  /**
   * Aggregate routes from config.routes and mix them into existing footprint
   * routes where needed.
   */
  buildCustomRoutes (config, footprintRoutes) {
    return lib.Transformer.mergeCustomRoutes(config.routes, footprintRoutes)
  },

  /**
   * Inject Policy prerequisites into the compiled route list.
   */
  buildRoutesWithPrerequisites (config, api, allRoutes) {
    return allRoutes.map(route => {
      return _.extend(route, lib.Transformer.getRoutePrerequisites(config.policies, route))
    })
  }
}
