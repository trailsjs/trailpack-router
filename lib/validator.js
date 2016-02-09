const joi = require('joi')
const lib = require('.')
const routeSchema = require('./schemas/route')

module.exports = {

  /**
   * Validate the structure of an individual route
   */
  validateRoute (route) {
    return new Promise((resolve, reject) => {
      joi.validate(route, routeSchema, (err, value) => {
        if (err) return reject(err)

        return resolve(value)
      })
    })
  },

  /**
   * Validate a route list
   */
  validateRouteList (routeList) {
    return lib.Util.findRouteConflicts(routeList)
  }

}
