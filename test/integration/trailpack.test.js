'use strict'

const assert = require('assert')
const _ = require('lodash')

describe('Router Trailpack', () => {

  describe('#initialize', () => {
    it('should set app.routes', () => {
      const routes = global.app.routes
      assert(_.isArray(routes))

      assert.equal(routes.length, 3)
      assert(_.isFunction(routes[0].handler))
      assert(_.isFunction(routes[1].handler))
      assert(_.isFunction(routes[2].handler))
    })
  })
})

