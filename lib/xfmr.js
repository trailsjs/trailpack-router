'use strict'

const _ = require('lodash')
const Footprints = require('./footprints')
const lib = require('./')

module.exports = {

  getPolicies (config, policies) {

  },

  getControllerMantissa (controllerName) {
    return controllerName.replace(/(\w+)Controller/, '$1')
  },

  getControllerHandlers (controllers) {
    return _.chain(controllers)
      .map((controller, controllerName) => {
        return _.map(_.functions(controller), handlerName => {
          return {
            controllerId: lib.Transformer.getControllerMantissa(controllerName),
            controllerName: controllerName,
            handlerName: handlerName
          }
        })
      })
      .flatten()
      .value()
  },

  getFootprintHandlerRoutes (config, api) {
    lib.Transformer.getControllerHandlers(api.controllers).map(handler => {
      return {
        id: Footprints.getRouteIdFromHandler(handler, 'footprint', config),
        method: '*',
        path: Footprints.getControllerPath(handler, config),
        handler: Footprints.getRouteHandler(handler)
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
      pre: _.map(policies, policy => {
        return {
          method: policy,
          assign: policy
        }
      })
    }
  }
}
