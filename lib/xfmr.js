const _ = require('lodash')
const Footprints = require('./footprints')

const Transformer = module.exports = {

  getPolicies (config, policies) {

  },

  getControllerMantissa (controllerName) {
    return controllerName.replace(/(\w+)Controller/, '$1')
  },

  getControllerHandlers (controllers) {
    return _.chain(controllers)
      .map((controller, controllerName) => {
        return _.map(_.functions(controller), handlerName => {
          return {
            controllerId: Transformer.getControllerMantissa(controllerName),
            controllerName: controllerName,
            handlerName: handlerName
          }
        })
      })
      .flatten()
      .value()
  },

  getFootprintHandlerRoutes (api) {
    Transformer.getControllerHandlers(api.controllers).map(handler => {
      return {
        id: Footprints.getRouteIdFromHandler(handler, 'footprint'),
        method: '*',
        path: Footprints.getControllerPath(handler),
        handler: Footprints.getRouteHandler(handler)
      }
    })
  },

  /**
   * Merge any custom routes or route overrides from config.routes into the
   * controller footprints routes.
   */
  mergeCustomRoutes (configRoutes, footprintRoutes) {
    let groupedFootprintRoutes = _.groupBy(footprintRoutes, route => Transformer.getRouteIdFromRoute(route, ''))
    let groupedConfigRoutes = _.groupBy(configRoutes, route => Transformer.getRouteIdFromRoute(route, ''))

    let mergedRoutes = _.merge(groupedFootprintRoutes, groupedConfigRoutes, (a, b) => {
      return _.reduce(_.union(a, b), _.merge)
    })

    return _.values(mergedGroups)
  }
}
