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
      Promise.all(this.app.config.get('routes').map(lib.Validator.validateRoute)),
      lib.Validator.validateRouteList(this.app.config.get('routes'))
    ])
  }

  /**
   * Compile route configuration and store in app.routes. Trailpacks that wish
   * to extend/add new routes should do so either in their configure() lifecycle
   * method, or by creating a config.routes list -- this list will be
   * automatically merged into the application's config.routes list.
   */
  initialize () {
    this.app.routes = this.app.config.get('routes')
      .map(route => lib.Util.buildRoute(this.app, route))
      .filter(route => !!route)
  }

  constructor (app) {
    super(app, {
      config: { },
      api: { },
      pkg: require('./package')
    })
  }
}

