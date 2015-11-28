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

  constructor (app, config) {
    super(app, require('./config'), require('./api'))
  }

  validate () {
    return Promise.all(this.app.config.routes, lib.Validator.validateRoute)
  }

  configure () {
    this.models = _.mapKeys(this.app.api.models, (model, modelName) => {
      return modelName.toLowerCase()
    })

    return Promise.resolve()
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
   *    Read      | GET    | /model       | .find
   *    Read      | GET    | /model/{id}  | .findOne
   *    Update    | PUT    | /model/{id?} | .update
   *    Delete    | DELETE | /model/{id?} | .destroy
   *    
   */
  initialize () {
    this.app.routes || (this.app.routes = [ ])

    let modelFootprintRoutes = lib.Footprints.getModelRoutes(this.config)
    let controllerFootprintRoutes = lib.Footprints.getControllerRoutes(this.config)
    let footprintRoutes = _.union(modelFootprintRoutes, controllerFootprintRoutes)

    this.app.routes = this.app.routes.concat(
      lib.Transformer.mergeCustomRoutes(this.config.routes, footprintRoutes)
    )

    return Promise.resolve()
  }
}
