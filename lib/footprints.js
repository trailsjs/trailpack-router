'use strict'

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

  getControllerPath (handler, config) {
    return Footprints.getRoutePath([
      '/',
      config.footprints.prefix,
      handler.controllerId,
      handler.handlerName
    ])
  },

  /**
   * Join an arbitrary number of path segments. This is probably the most
   * important method in this trailpack. Generating these route paths correctly
   * is critical for the correct behavior of the rest of the system. Don't be
   * scared of the regular expressions; this method is only run during boot,
   * and should not be called while the server is handling requests.
   *
   * Notes:
   * 1. path.join is os-dependent (i.e. it will break on windows with forward
   *  slashes). We learned this the hard way.
   *
   * 2. url.resolve urlencodes the path, and thus breaks the hapi path
   *  parameter syntax involving braces. We learned this the hard way, also.
   *
   * 3. This method will never include a trailing slash.
   *
   * 4. This function tries to be very helpful, and accept just about anything
   * you throw at it. It also self-validates its expected result, and will throw
   * if it's converted your input into something it doesn't recognize. This is
   * partially why it may look more complex than it needs to be.
   *
   */
  getRoutePath () {
    const slashGroupRegex = /\/{2,}/g
    const slashTrailRegex = /(^\/)|(\/$)/g
    const slashValidRegex = /^(\/)|((\/[^\/]+)+)$/

    const segments = _.compact(_.flattenDeep(_.toArray(arguments)))
    const isArgumentsValid = segments.length && _.every(segments, s => _.isArray(s) || _.isString(s))

    if (!isArgumentsValid) {
      throw new TypeError([
        'trailpack-router cannot parse the arguments given to Footprints.getRoutePath:',
        segments, 'Argument types not recognized'
      ].join(' '))
    }

    const path = '/' + segments.join('/')
      .replace(slashGroupRegex, '/')
      .replace(slashTrailRegex, '')

    if (!slashValidRegex.test(path)) {
      throw new RangeError([
        'trailpack-router produced an invalid route path: ', path,
        'arguments given:', segments
      ].join(' '))
    }

    return path
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
        path: Footprints.getRoutePath([ config.footprints.prefix, route.path ]),
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
