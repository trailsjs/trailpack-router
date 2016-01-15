'use strict'

const _ = require('lodash')
const lib = require('./')

module.exports = {

  /**
   * Aggregate and combine footprint routes from Model actions and Controller
   * handlers
   */
  buildFootprintRoutes (app) {
    const config = app.config
    const modelFootprintRoutes = lib.Footprints.getModelRoutes(config)
    const controllerFootprintRoutes = lib.Footprints.getControllerRoutes(app)
    return  _.union(modelFootprintRoutes, controllerFootprintRoutes)
  },

  /**
   * Aggregate routes from config.routes and mix them into existing footprint
   * routes where needed.
   */
  buildCustomRoutes (app, footprintRoutes) {
    return lib.RouteBuilder.mergeCustomRoutes(app.config.routes, footprintRoutes)
  },

  /**
   * Inject Policy prerequisites into the compiled route list.
   */
  buildRoutesWithPrerequisites (app, allRoutes) {
    return allRoutes.map(route => {
      return _.merge(route, lib.RouteBuilder.getRoutePrerequisites(app.config.policies, route))
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
   * Merge all routes defined in all trailpacks with those defined in the
   * application.
   */
  mergeTrailpackRoutes (appRoutes, packRoutes) {
    return _.uniqBy(_.compact(packRoutes.concat(appRoutes)), route => {
      return lib.Footprints.getRouteIdFromRoute(route, 'mergeTrailpackRoutes')
    })
  },

  getControllerMantissa (controllerName) {
    return controllerName.replace(/(\w+)Controller/, '$1')
  },

  getControllerHandlers (controllers) {
    return _.chain(controllers)
      .omit('FootprintController')
      .map((controller, controllerName) => {
        return _.map(controller.methods, handlerName => {
          return {
            controllerId: lib.RouteBuilder.getControllerMantissa(controllerName).toLowerCase(),
            controllerName: controllerName,
            handlerName: handlerName
          }
        })
      })
      .flatten()
      .value()
  },

  /**
   * Get policy prerequisites for the given route. The route handler must be in
   * the form "Controller.handler"
   */
  getRoutePrerequisites (policiesConfig, route) {
    const handlerTokens = route.handler.split('.')
    const controller = handlerTokens[0]
    const handler = handlerTokens[1]

    const policies = _.get(policiesConfig, [ controller, handler ]) || [ ]

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
