'use strict'

const path = require('path')
const _ = require('lodash')
const lib = require('./')

const Footprints = module.exports = {

  getRouteIdFromRoute (route, type) {
    return `[${type}] ${route.path} -> ${route.handler}`
  },

  getRouteIdFromHandler (handler, type, config) {
    const path = Footprints.getControllerPath(handler, config)
    return `[${type}] ${path} -> ${handler.handlerName}`
  },

  getRouteHandler (handler) {
    return `${handler.controllerName}.${handler.handlerName}`
  },

  getControllerPath (handler, config) {
    return path.join(
      '/',
      config.footprints.prefix,
      handler.controllerId,
      handler.handlerName
    )
  },

  getModelRoutes (config) {
    if (!config.footprints.models.actions) return [ ]

    const enabledRoutes = _.keys(_.pick(config.footprints.models.actions, _.identity))
    return _.map(_.values(_.pick(config.footprints.models.routes, enabledRoutes)), route => {
      return {
        method: route.method,
        path: path.join('/', config.footprints.prefix, route.path),
        handler: route.handler
      }
    })
  },

  getControllerRoutes (config, api) {
    if (!config.footprints.controllers) return [ ]

    return lib.Transformer.getFootprintHandlerRoutes(config, api)
  }
}
