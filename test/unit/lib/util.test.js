const assert = require('assert')
const lib = require('../../../lib')

describe('lib.util', () => {

  describe('#findRouteConflicts', () => {
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

  })

})

