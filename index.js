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

  configure () {
    this.models = _.mapKeys(_.omit(this.app.api.models, 'inspect'), (model, modelName) => {
      return modelName.toLowerCase()
    })
  }

  /**
   * Merge route configuration and store in app.routes. Trailpacks that wish to
   * extend/add new routes should do so in the configure() lifecycle method.
   *
   * 1. ETL controller handlers into the standard route format.
   *    api.controllers.handlers  --> (map)
   *                              --> [ { controllerId, controllerName, handlerName } ]
   *                              --> (map)
   *                              --> [ { id, method, path, handler } ]
   *               config.routes  --> (group by path + handler)
   *                              --> { routeId: [ { id, method, path, handler } ] }
   *               config.routes  --> (merge each route group)
   *                              --> [ { id, method, path, handler } ]
   *                              --> app.routes
   *
   * 2. Create CRUD Route definition which maps to api.controllers.FootprintController
   *
   *    Operation | Method | Path         | ORM Action
   *    ----------+--------+--------------+------------
   *    Create    | POST   | /model       | .create
   *    Read      | GET    | /model/{id?} | .find
   *    Update    | PUT    | /model/{id?} | .update
   *    Delete    | DELETE | /model/{id?} | .destroy
   *
   * 3. Attach Policies as prerequisites.
   *    @see http://hapijs.com/api#route-prerequisites
   */
  initialize () {
    const footprintRoutes = lib.RouteBuilder.buildFootprintRoutes(this.app.config, this.app.api)
    const allRoutes = lib.RouteBuilder.buildCustomRoutes(this.app.config, footprintRoutes)
    const completedRoutes = lib.RouteBuilder.buildRoutesWithPrerequisites(this.app.config, this.app.api, allRoutes)

    this.app.routes = completedRoutes
  }

  constructor (app) {
    super(app, {
      config: require('./config'),
      api: require('./api'),
      pkg: require('./package')
    })
  }
}

