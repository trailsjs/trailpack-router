const joi = require('joi')
const routeSchema = require('./schemas/route')

module.exports = {
  validateRoute (route) {
    return new Promise((resolve, reject) => {
      joi.validate(route, routeSchema, (err, value) => {
        if (err) return reject(err)

        return resolve(value)
      })
    })
  }
}
