'use strict'

const _ = require('lodash')
const Footprints = require('./footprints')
const Hoek = require('Hoek')
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
          id: Footprints.getRouteIdFromHandler(handler, 'footprint', config)
        }
      }
    })
  },

  /**
   * Merge any custom routes or route overrides from config.routes into the
   * controller footprints routes.
   */
  mergeCustomRoutes (configRoutes, footprintRoutes) {
    const groupedFootprintRoutes = _.groupBy(footprintRoutes, route => lib.Footprints.getRouteIdFromRoute(route, ''))
    const groupedConfigRoutes = _.groupBy(configRoutes, route => lib.Footprints.getRouteIdFromRoute(route, ''))

    const mergedRoutes = _.merge(groupedFootprintRoutes, groupedConfigRoutes, (a, b) => {
      return _.reduce(_.union(a, b), _.merge)
    })

    return _.flatten(_.values(mergedRoutes))
  },

  /**
   * Get policy prerequisites for the given route. The route handler must be in
   * the form "Controller.handler"
   */
  getRoutePrerequisites (policiesConfig, route) {
    let policies

    if (_.isString(route.handler)) {
      policies = _.get(policiesConfig, route.handler)
    }
    else if (_.isPlainObject(route.handler)) {
      if (route.handler.directory) {
        policies = policiesConfig.directories[route.handler.directory.path]
      } 
      else if (route.handler.file) {
        policies = policiesConfig.files[route.handler.file]
      } 
      else {
        Hoek.assert(!route.handler.directory && !route.handler.file, 'policy not recognized')
      }
    }

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
