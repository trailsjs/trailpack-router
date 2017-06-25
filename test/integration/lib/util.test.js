const assert = require('assert')
const _ = require('lodash')
const lib = require('../../../lib')

describe('lib.Util', () => {
  describe('#buildRoute', () => {
    it('should build valid route in typical case', () => {
      const routes = global.app.config.routes
      const route = lib.Util.buildRoute(global.app, routes[0])

      assert(_.isString(route.path))
      assert(_.isFunction(route.handler))
    })
    it('should resolve the route handler to the correct controller method', () => {
      const route = lib.Util.buildRoute(global.app, {
        method: '*',
        path: '/foo/bar',
        handler: 'FooController.bar'
      })

      assert.equal(route.handler, global.app.controllers.FooController.bar)
    })
    it('should resolve the prerequisite handler (string) to the correct policy method', () => {
      const route = lib.Util.buildRoute(global.app, {
        method: '*',
        path: '/foo/bar',
        handler: 'FooController.bar',
        config: {
          pre: [
            'FooPolicy.bar'
          ]
        }
      })

      assert.equal(route.config.pre[0], global.app.policies.FooPolicy.bar)
    })
    it('should resolve the prerequisite handler (object) to the correct policy method', () => {
      const route = lib.Util.buildRoute(global.app, {
        method: '*',
        path: '/foo/bar',
        handler: 'FooController.bar',
        config: {
          pre: [
            {
              method: 'FooPolicy.bar'
            }
          ]
        }
      })

      assert.equal(route.config.pre[0], global.app.policies.FooPolicy.bar)
    })
  })

})
