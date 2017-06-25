const assert = require('assert')
const lib = require('../../../lib')

describe('lib.util', () => {

  describe('#findRouteConflicts', () => {
    const handler = function () { }

    it('should return empty list if there are no route conflicts', () => {
      const routes = [
        {
          method: 'GET',
          path: '/test/foo',
          handler: 'TestController.foo'
        },
        {
          method: [ 'GET', 'POST' ],
          path: '/',
          handler: 'HomeController.index'
        }
      ]

      const conflicts = lib.Util.findRouteConflicts(routes)

      assert.equal(conflicts.length, 0)
    })
    it('should return list of errors if there are route conflicts', () => {
      const routes = [
        {
          method: 'GET',
          path: '/test/foo',
          handler: 'TestController.foo'
        },
        {
          method: [ 'GET', 'POST' ],
          path: '/test/foo',
          handler: 'TestController.bar'
        }
      ]

      const conflicts = lib.Util.findRouteConflicts(routes)

      assert.equal(conflicts.length, 1)
    })
    it('should return no results for a valid route list', () => {
      const routeList = [
        { method: '*', path: '/a', handler: handler },
        { method: '*', path: '/b', handler: handler },
        { method: '*', path: '/c', handler: handler }
      ]

      const conflicts = lib.Util.findRouteConflicts(routeList)
      assert.equal(conflicts.length, 0)
    })
    it('should return no errors for identical paths with different methods', () => {
      const routeList = [
        { method: 'GET', path: '/a', handler: handler },
        { method: [ 'POST', 'PUT' ], path: '/a', handler: handler },
        { method: '*', path: '/c', handler: handler }
      ]

      const conflicts = lib.Util.findRouteConflicts(routeList)
      assert.equal(conflicts.length, 0)
    })
    it('should return errors for routes with identical paths and overlapping wildcard method', () => {
      const routeList = [
        { method: '*', path: '/a', handler: handler },
        { method: 'GET', path: '/a', handler: handler },
      ]

      const conflicts = lib.Util.findRouteConflicts(routeList)
      assert.equal(conflicts.length, 1)
    })
    it('should detect invalid route list (duplicate paths)', () => {
      const routeList = [
        { method: 'GET', path: '/a', handler: handler },
        { method: 'GET', path: '/a', handler: handler }
      ]

      const conflicts = lib.Util.findRouteConflicts(routeList)

      assert.equal(conflicts.length, 1)
      assert.equal(conflicts[0].errors[0].message, 'New route /a conflicts with existing /a')
    })
    it('should detect multiple errors in invalid route list (duplicate paths)', () => {
      const routeList = [
        { method: 'GET', path: '/a', handler: handler },
        { method: 'GET', path: '/a', handler: handler },
        { method: 'GET', path: '/a', handler: handler }
      ]

      const conflicts = lib.Util.findRouteConflicts(routeList)

      assert.equal(conflicts.length, 2)
      assert.equal(conflicts[0].errors[0].message, 'New route /a conflicts with existing /a')
    })
    it('should validate non-overlapping methods for a single path', () => {
      const routeList = [
        { method: 'POST', path: '/a', handler: handler },
        { method: 'GET', path: '/a', handler: handler }
      ]

      const conflicts = lib.Util.findRouteConflicts(routeList)
      assert.equal(conflicts.length, 0)
    })

  })

})

