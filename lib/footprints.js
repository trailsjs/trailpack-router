'use strict'

const path = require('path')
const _ = require('lodash')
const lib = require('./')

const Footprints = module.exports = {

  getRouteIdFromRoute (route, type) {
    return `[${type}] ${route.path} -> ${route.handler}`
  },

  getRouteIdFromHandler (handler, type, config) {
    let path = Footprints.getControllerPath(handler, config)
    return `[${type}] ${path} -> ${handler.handlerName}`
  },

  getRouteHandler (handler) {
    return `${handler.controllerName}.${handler.handlerName}`
  },

  getControllerPath (handler, config) {
    return path.join(
      '/',
      config.footprints.prefix,
      handler.controllerName,
      handler.handlerName
    )
  },

  getModelRoutes (config) {
    if (!config.footprints.models.routes) return [ ]

    let enabledRoutes = _.keys(_.pick(config.footprints.models.actions, _.identity))
    return _.values(_.pick(config.footprints.models.routes, enabledRoutes))
  },

  getControllerRoutes (config, api) {
    if (!config.footprints.models.controllers) return [ ]

    return lib.Transformer.getFootprintHandlerRoutes(config, api)
  },

  getRoutePolicies (config, route) {

  }
}
