'use strict'

const assert = require('assert')
const _ = require('lodash')

describe('Router Trailpack', () => {

  describe('#initialize', () => {
    it('should set app.routes', () => {
      const routes = global.app.routes
      assert(_.isArray(routes))

      assert(_.find(routes, { handler: 'TestController.foo' }))
      assert(_.find(routes, { handler: 'HomeController.index' }))
      assert(_.find(routes, { handler: 'FooController.bar' }))
    })
  })
})

