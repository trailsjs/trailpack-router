'use strict'

const path = require('path')
const _ = require('lodash')
const lib = require('./')

const Footprints = module.exports = {

  /**
   * Generate an id from a hapi route object
   */
  getRouteIdFromRoute (route, type) {
    return `[${type}] ${route.path} -> ${route.handler}`
  },

  /**
   * Generate an id from a handler name
   */
  getRouteIdFromHandler (handler, type, config) {
    const path = Footprints.getControllerPath(handler, config)
    return `[${type}] ${path} -> ${Footprints.getRouteHandler(handler)}`
  },

  /**
   * Get the handler dot-path from the controller and action names
   */
  getRouteHandler (handler) {
    return `${handler.controllerName}.${handler.handlerName}`
  },

  /**
   * Get full path (uri) string for the route
   */
  getControllerPath (handler, config) {
    return path.join(
      '/',
      config.footprints.prefix || '',
      handler.controllerId || '',
      handler.handlerName || ''
    )
  },

  /**
   * Get the model footprint routes based on the footprints.models
   * configuration
   */
  getModelRoutes (config) {
    if (!config.footprints.models.actions) return [ ]

    const enabledRoutes = _.keys(_.pickBy(config.footprints.models.actions, _.identity))
    return _.map(_.values(_.pick(config.footprints.models.routes, enabledRoutes)), route => {
      return {
        method: route.method,
        path: path.join('/', config.footprints.prefix, route.path),
        handler: route.handler
      }
    })
  },

  getControllerRoutes (app) {
    if (!app.config.footprints.controllers) return [ ]

    return lib.Footprints.getFootprintHandlerRoutes(app)
  },

  getFootprintHandlerRoutes (app) {
    return lib.RouteBuilder.getControllerHandlers(app.controllers).map(handler => {
      return {
        method: '*',
        path: lib.Footprints.getControllerPath(handler, app.config),
        handler: lib.Footprints.getRouteHandler(handler),
        config: {
          id: lib.Footprints.getRouteIdFromHandler(handler, 'footprint', app.config)
        }
      }
    })
  }
}
