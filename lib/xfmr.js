'use strict'

const _ = require('lodash')
const Footprints = require('./footprints')
const lib = require('./')

module.exports = {

  getControllerMantissa (controllerName) {
    return controllerName.replace(/(\w+)Controller/, '$1')
  },

  getControllerHandlers (controllers) {
    return _.chain(controllers)
      .omit('FootprintController')
      .map((controller, controllerName) => {
        return _.map(_.functions(controller), handlerName => {
          return {
            controllerId: lib.Transformer.getControllerMantissa(controllerName).toLowerCase(),
            controllerName: controllerName,
            handlerName: handlerName
          }
        })
      })
      .flatten()
      .value()
  },

  getFootprintHandlerRoutes (config, api) {
    return lib.Transformer.getControllerHandlers(api.controllers).map(handler => {
      return {
        method: '*',
        path: Footprints.getControllerPath(handler, config),
        handler: Footprints.getRouteHandler(handler),
        config: {
          id: Footprints.getRouteIdFromHandler(handler, 'footprint', config),
        }
      }
    })
  },

  /**
   * Merge any custom routes or route overrides from config.routes into the
   * controller footprints routes.
   */
  mergeCustomRoutes (configRoutes, footprintRoutes) {
    let groupedFootprintRoutes = _.groupBy(footprintRoutes, route => lib.Footprints.getRouteIdFromRoute(route, ''))
    let groupedConfigRoutes = _.groupBy(configRoutes, route => lib.Footprints.getRouteIdFromRoute(route, ''))

    let mergedRoutes = _.merge(groupedFootprintRoutes, groupedConfigRoutes, (a, b) => {
      return _.reduce(_.union(a, b), _.merge)
    })

    return _.flatten(_.values(mergedRoutes))
  },

  /**
   * Get policy prerequisites for the given route. The route handler must be in
   * the form "Controller.handler"
   */
  getRoutePrerequisites (policiesConfig, route) {
    let handlerTokens = route.handler.split('.')
    let controller = handlerTokens[0]
    let handler = handlerTokens[1]

    let policies = _.get(policiesConfig, [ controller, handler ]) || [ ]

    return {
      config: {
        pre: _.map(policies, policy => {
          return {
            method: policy,
            assign: policy
          }
        })
      }
    }
  }
}
