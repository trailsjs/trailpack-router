const lib = require('./')

const Footprints = module.exports = {

  getRouteIdFromRoute (route, type) {
    return `[${type}] ${route.path} -> ${route.handler}`
  },

  getRouteIdFromHandler (handler, type) {
    let path = Footprints.getControllerPath(handler)
    return `[${type}] ${path} -> ${handler.handlerName}`
  },

  getRouteHandler (handler) {
    return `${handler.controllerName}.${handler.handlerName}`
  },

  getControllerPath (handler) {
    return `/${handler.controllerName}/${handler.handlerName}`
  },

  getModelRoutes (config) {
    if (!config.routes.footprints) return [ ]

    let enabledRoutes = _.keys(_.pick(config.models.routes, _.identity))
    return _.pick(config.routes.footprints, enabledRoutes)
  }

  getControllerRoutes (config) {
    if (!config.footprints.models.controllers) return [ ]

    return lib.Transformer.getFootprintHandlerRoutes(this.app.api) : [ ]
  }

}
