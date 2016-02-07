'use strict'

const assert = require('assert')
const lib = require('../../../lib')
const _ = require('lodash')

describe('lib.util', () => {

  describe('#getRoutePath', () => {
    it('should generate correct path for typical use case', () => {
      assert.equal(lib.Util.getRoutePath([ 'foo', 'bar' ]), '/foo/bar')
    })
    it('should generate correct path for boundary case', () => {
      assert.equal(lib.Util.getRoutePath('/'), '/')
    })
    it('should generate correct path when given leading and trailing slashes', () => {
      assert.equal(lib.Util.getRoutePath([ 'foo', '/bar' ]),   '/foo/bar')
      assert.equal(lib.Util.getRoutePath([ '/foo', 'bar' ]),   '/foo/bar')
      assert.equal(lib.Util.getRoutePath([ '/foo', '/bar' ]),  '/foo/bar')
      assert.equal(lib.Util.getRoutePath([ 'foo/', '/bar' ]),  '/foo/bar')
      assert.equal(lib.Util.getRoutePath([ 'foo', '/bar/' ]),  '/foo/bar')
      assert.equal(lib.Util.getRoutePath([ '/foo/', '/bar/' ]),'/foo/bar')
      assert.equal(lib.Util.getRoutePath([ '/foo/', 'bar' ]),  '/foo/bar')

      assert.equal(lib.Util.getRoutePath([ '/foo//', '/baz/', '//bar/' ]),'/foo/baz/bar')
    })
    it('should generate correct path when given hapi path params', () => {
      assert.equal(lib.Util.getRoutePath([ 'foo', '/{model}/{id?}' ]),   '/foo/{model}/{id?}')
      assert.equal(lib.Util.getRoutePath([ 'foo', '/{model}/{id?}/' ]),   '/foo/{model}/{id?}')
      assert.equal(lib.Util.getRoutePath([ 'foo', '{model}/{id?}' ]),   '/foo/{model}/{id?}')
    })
    it('should generate correct path when given an array with one element', () => {
      assert.equal(lib.Util.getRoutePath([ 'foo/bar' ]),   '/foo/bar')
      assert.equal(lib.Util.getRoutePath([ '/foo/bar/' ]),   '/foo/bar')
      assert.equal(lib.Util.getRoutePath([ '/foo//bar/' ]),   '/foo/bar')
    })
    it('should generate correct path when given a raw string', () => {
      assert.equal(lib.Util.getRoutePath('foo/bar'),   '/foo/bar')
    })
    it('should generate correct path when given regular arguments', () => {
      assert.equal(lib.Util.getRoutePath('foo', 'bar'),   '/foo/bar')
      assert.equal(lib.Util.getRoutePath('/foo', '/bar'),   '/foo/bar')
    })
    it('should generate correct path when given unlikely craziness', () => {
      assert.equal(lib.Util.getRoutePath('foo', [ 'bar', [ 'baz/boo///' ] ]), '/foo/bar/baz/boo')
    })
    it('should fail if unparseable inputs are provided', () => {
      assert.throws(() => lib.Util.getRoutePath(function () { }), TypeError)
    })
    it('should fail if no arguments provided', () => {
      assert.throws(() => lib.Util.getRoutePath(), TypeError)
    })
    it('should fail if falsy arguments provided', () => {
      assert.throws(() => lib.Util.getRoutePath(null), TypeError)
      assert.throws(() => lib.Util.getRoutePath(''), TypeError)
      assert.throws(() => lib.Util.getRoutePath(undefined), TypeError)
      assert.throws(() => lib.Util.getRoutePath(false), TypeError)
      assert.throws(() => lib.Util.getRoutePath([ false, null ]), TypeError)
    })
  })

  describe('#getRouteId', () => {
    const routes = [
      {
        method: 'GET',
        path: '/foo/bar',
        handler: 'FooController.fooHandler'
      },
      {
        method: [ 'GET', 'POST' ],
        path: '/',
        handler: 'FooController.fooHandler'
      },
      {
        method: '*',
        path: '/foo/bar',
        handler: 'FooController.fooHandler'
      }
    ]
    it('should generate a route id from a hapijs route object (single method)', () => {
      assert.equal(lib.Util.getRouteId(routes[0]), '[GET] /foo/bar -> FooController.fooHandler')
    })
    it('should generate a route id from a hapijs route object (multiple methods)', () => {
      assert.equal(lib.Util.getRouteId(routes[1]), '[GET,POST] / -> FooController.fooHandler')
    })
    it('should generate a route id from a hapijs route object (wildcard method)', () => {
      assert.equal(lib.Util.getRouteId(routes[2]), '[*] /foo/bar -> FooController.fooHandler')
    })
  })

  describe('#getRoutePrerequisites', () => {
    const policies = {
      FooController: [ 'FooPolicy.foo', 'FooPolicy.bar' ],
      BarController: {
        testHandler: [ 'BarPolicy.test' ]
      }
    }
    const routes = [
      {
        method: 'GET',
        path: '/foo/foo',
        handler: 'FooController.fooHandler'
      },
      {
        method: '*',
        path: '/bar/test',
        handler: 'BarController.testHandler'
      },
      {
        method: [ 'GET', 'POST' ],
        path: '/bar/foo',
        handler: 'BarController.fooHandler'
      }
    ]

    it('should attach controller-wide policies to all handlers in Controller', () => {
      let pre = lib.Util.getRoutePrerequisites(policies, routes[0])
      assert(_.includes(pre, 'FooPolicy.foo'))
      assert(_.includes(pre, 'FooPolicy.bar'))
      assert.equal(pre.length, 2)
    })
    it('should attach handler-specific policies to the corresponding handler in Controller', () => {
      let pre = lib.Util.getRoutePrerequisites(policies, routes[1])
      assert(_.includes(pre, 'BarPolicy.test'))
      assert.equal(pre.length, 1)
    })
    it('should attach no policies to handler which does not match any policy config', () => {
      let pre = lib.Util.getRoutePrerequisites(policies, routes[2])
      assert.equal(pre.length, 0)
    })
  })

  describe('#decorateRouteWithPrerequisites', () => {
    const policies = {
      FooController: [ 'FooPolicy.foo', 'FooPolicy.bar' ],
      BarController: {
        testHandler: [ 'BarPolicy.test' ]
      }
    }
    const routes = [
      {
        method: 'GET',
        path: '/foo/foo',
        handler: 'FooController.fooHandler'
      },
      {
        method: '*',
        path: '/bar/test',
        handler: 'BarController.testHandler'
      },
      {
        method: [ 'GET', 'POST' ],
        path: '/bar/foo',
        handler: 'BarController.fooHandler'
      }
    ]

    it('should decorate route with preconditions', () => {
      let route = lib.Util.decorateRouteWithPrerequisites(policies, routes[0])

      assert(_.isObject(route.config))
      assert(_.isArray(route.config.pre))
      assert(_.find(route.config.pre, { method: 'FooPolicy.foo' }))
      assert(_.find(route.config.pre, { method: 'FooPolicy.bar' }))
    })
  })
})

