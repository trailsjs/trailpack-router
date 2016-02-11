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
    return Promise.all([
      Promise.all(_.map(this.app.config.routes, lib.Validator.validateRoute)),
      lib.Validator.validateRouteList(this.app.config.routes)
    ])
  }

  /**
   * Compile route configuration and store in app.routes. Trailpacks that wish
   * to extend/add new routes should do so either in their configure() lifecycle
   * method, or by creating a config.routes list -- this list will be
   * automatically merged into the application's config.routes list.
   */
  initialize () {
    this.app.routes = _.compact(
      _.map(this.app.config.routes, route => lib.Util.buildRoute(this.app, route))
    )
  }

  constructor (app) {
    super(app, {
      config: require('./config'),
      api: require('./api'),
      pkg: require('./package')
    })
  }

  /**
   * Expose the "util" module on the public API
   */
  get util () {
    return lib.Util
  }
}

