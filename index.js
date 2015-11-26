'use strict'

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

  constructor (app, config) {
    super(app, require('./config'))
  }

  getName () {
    return 'router'
  }

  validate () {
    return Promise.all(this.app.config.routes, lib.Validator.validateRoute)
  }

  /**
   * Merge route configuration and store in app.routes.
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
   *    Read      | GET    | /model       | .find
   *    Read      | GET    | /model/{id}  | .findOne
   *    Update    | PUT    | /model/{id?} | .update
   *    Delete    | DELETE | /model/{id?} | .destroy
   *    
   */
  configure () {
    this.app.routes || (this.app.routes = [ ])

    return this.app.after('trailpack:core:configured')
      .then(() => {
        let config = this.app.config
        let modelFootprintRoutes = Footprints.getModelRoutes(config)
        let controllerFootprintRoutes = Footprints.getControllerRoutes(config)

        this.app.routes = this.app.routes.concat(
          lib.Transformer.mergeCustomRoutes(this.app.config.routes, footprintRoutes)
        )
      })
  }
}
