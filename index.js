'use strict'

const _ = require('lodash')
const Trailpack = require('trailpack')
const lib = require('./lib')

/**
 * trailpack-router
 *
 * Unify all route handlers into a single, standard route object format. Route
 * objects are structured as Hapi.js routes.
 *
 * @see http://hapijs.com/api#route-configuration
 * @see https://github.com/trailsjs/trailpack-hapi
 * @see https://github.com/trailsjs/trailpack-koa
 * @see https://github.com/trailsjs/trailpack-express4
 */
module.exports = class Router extends Trailpack {

  validate () {
    return Promise.all(_.map(this.app.config.routes, lib.Validator.validateRoute))
  }

  /**
   * Compile route configuration and store in app.routes. Trailpacks that wish
   * to extend/add new routes should do so either in their configure() lifecycle
   * method, or by creating a config.routes list -- this list will be
   * automatically merged into the application's config.routes list.
   */
  initialize () {
    this.app.routes = _.map(this.app.config.routes, route => {
      return lib.Util.decorateRouteWithPrerequisites(this.app.config.policies, route)
    })
  }

  constructor (app) {
    super(app, {
      config: require('./config'),
      api: require('./api'),
      pkg: require('./package')
    })
  }
}

