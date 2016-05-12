'use strict'

const _ = require('lodash')
const call = require('call')
const lib = require('.')

module.exports = {

  /**
   * Build a complete route, with bound handler and attached preconditions
   */
  buildRoute (app, rawRoute) {
    const route = lib.Util.decorateRouteWithPrerequisites(app, rawRoute)
    route.handler = _.get(app.controllers, rawRoute.handler)

    if (!route.handler) {
      app.log.warn('trailpack-router: route handler [', rawRoute.handler, ']',
        'does not correspond to any defined Controller handler')

      return
    }

    return route
  },

  /**
   * Return the route the "pre" property populated with prerequisites.
   * @see http://hapijs.com/api#route-prerequisites
   */
  decorateRouteWithPrerequisites (app, route) {
    const policies = app.config.policies
    const prerequisites = lib.Util.getRoutePrerequisites(policies, route)

    return _.defaultsDeep({ }, route, {
      config: {
        pre: _.compact(_.map(prerequisites, policy => {
          const pre = _.get(app.policies, policy)

          if (!pre) {
            app.log.warn('trailpack-router: route prerequisite [', policy, ']',
              'does not correspond to any defined Policy')
          }

          return pre
        }))
      }
    })
  },

  /**
   * Get policy prerequisites for the given route. The route handler must be in
   * the form "Controller.handler"
   */
  getRoutePrerequisites (policiesConfig, route) {
    const handlerTokens = route.handler.split('.')
    const controller = handlerTokens[0]
    const handler = handlerTokens[1]

    const controllerPolicies = _.get(policiesConfig, controller) || [ ]
    const handlerPolicies = _.get(policiesConfig, [ controller, handler ]) || [ ]

    return _.isArray(controllerPolicies) ? controllerPolicies : handlerPolicies
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
   *  slashes). We learned this the hard way, so while it is a convenient tool
   *  for joining paths, we are not using it here.
   *
   * 2. url.resolve urlencodes the path, and thus breaks the hapi path
   *  parameter syntax involving braces. We learned this the hard way, also.
   *
   * 3. This method will never include a trailing slash in the route paths it
   * produces.
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

    const argv = _.compact(_.flattenDeep(_.toArray(arguments)))
    const isArgumentsValid = argv.length && _.every(argv, s => _.isArray(s) || _.isString(s))

    if (!isArgumentsValid) {
      throw new TypeError([
        'trailpack-router cannot parse the arguments given to Footprints.getRoutePath:',
        argv, 'Argument types not recognized'
      ].join(' '))
    }

    const path = '/' + argv.join('/')
      .replace(slashGroupRegex, '/')
      .replace(slashTrailRegex, '')

    if (!slashValidRegex.test(path)) {
      throw new RangeError(
        `trailpack-router produced an invalid route path: ${path}. Arguments given: ${argv}`
      )
    }

    return path
  },

  /**
   * Return routes that have inconsistent paths and methods. Multiple routes
   * can exist with the same path, but not if the methods overlap or are the
   * same.
   */
  findRoutePathConflicts (route, routeList) {
    return _.filter(routeList, _route => {
      const methodIntersection = _.intersection(
        _.flatten([ route.method ]), _.flatten([ _route.method ])
      )
      const isMethodOverlap = methodIntersection.length > 0
      const isPathIdentical = route.path == _route.path

      return isPathIdentical && isMethodOverlap
    })
  },

  /**
   * Return routes that have identical paths and handlers.
   */
  findRouteHandlerConflicts (route, routeList) {
    return _.filter(routeList, {
      handler: route.handler,
      path: route.path
    })
  },

  /**
   * Return an error if the given route is not compatible with the router;
   * return null otherwise.
   */
  getRouteConflict (router, route) {
    return _.compact(_.map(_.flatten([ route.method ]), method => {
      try {
        router.add(_.defaults({ method: method }, route))
        return null
      }
      catch (e) {
        return e
      }
    }))
  },

  /**
   * Find conflicts within a particular route list which cannot be cleverly
   * reconciled by the program logic, and which require corrective action from
   * the developer.
   */
  findRouteConflicts (routeList) {
    const router = new call.Router()
    const conflicts = _.map(routeList, route => {
      return {
        route: route,
        errors: lib.Util.getRouteConflict(router, route)
      }
    })
    return _.filter(conflicts, conflict => conflict.errors.length)
  },

  /**
   * Combine two route lists, removing duplicate (conflicting) routes,
   * preferring those in overrides.
   */
  mergeRoutes (routes, overrides) {
    const filteredRoutes = _.filter(routes, route => {
      const pathConflicts = lib.Util.findRoutePathConflicts(route, overrides)
      const handlerConflicts = lib.Util.findRouteHandlerConflicts(route, overrides)

      return pathConflicts.length === 0 && handlerConflicts.length === 0
    })

    return _.union(filteredRoutes, overrides)
  },

  /**
   * Generate an id from a hapi route object. If an id is already set, return
   * it.
   */
  getRouteId (route) {
    const id = _.get(route.config, 'id')
    if (id) return id

    return `[${route.method}] ${route.path} -> ${route.handler}`
  }
}

