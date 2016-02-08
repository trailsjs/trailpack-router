'use strict'

const assert = require('assert')
const _ = require('lodash')
const lib = require('../../../lib')

describe('lib.Util', () => {
  describe('#decorateRouteWithPrerequisites', () => {
    it('should decorate route with preconditions', () => {
      const routes = global.app.config.routes
      const route = lib.Util.decorateRouteWithPrerequisites(global.app, routes[2])

      assert(_.isObject(route.config))
      assert(_.isArray(route.config.pre))
      assert.equal(route.config.pre.length, 1)
      assert(_.isFunction(route.config.pre[0]))
    })
    it('should not decorate route with any preconditions when no policy configuration applies', () => {
      const routes = global.app.config.routes
      const route = lib.Util.decorateRouteWithPrerequisites(global.app, routes[0])

      assert.equal(route.config.pre.length, 0)
    })
  })

  describe('#buildRoute', () => {
    it('should build valid route in typical case', () => {
      const routes = global.app.config.routes
      const route = lib.Util.buildRoute(global.app, routes[0])

      assert(_.isString(route.path))
      assert(_.isFunction(route.handler))
    })
    it('should attach preconditions to route with relevant policies configuration', () => {
      const routes = global.app.config.routes
      const route = lib.Util.buildRoute(global.app, routes[2])

      assert(_.isString(route.path))
      assert(_.isFunction(route.handler))
      assert(_.isFunction(route.config.pre[0]))
    })

  })
})
