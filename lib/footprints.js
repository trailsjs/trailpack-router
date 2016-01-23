'use strict'

const url = require('url')
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
    const controllerPath = _.compact([
      config.footprints.prefix,
      handler.controllerId,
      handler.handlerName
    ]).join('/')

    return (controllerPath.charAt(0) == '/' ? '' : '/') + controllerPath
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
        path: url.resolve(config.footprints.prefix, route.path),
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
        method: [ 'GET', 'POST' ],
        path: lib.Footprints.getControllerPath(handler, app.config),
        handler: lib.Footprints.getRouteHandler(handler)
      }
    })
  }
}
