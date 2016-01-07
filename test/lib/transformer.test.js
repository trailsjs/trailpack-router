const assert = require('assert')
const lib = require('../../lib')

describe('lib.Transformer', () => {
  const testRoutesA = [
    {
      method: [ 'GET' ],
      path: '/foo',
      handler: 'TestController.getFoo'
    },
    {
      method: 'POST',
      path: '/foo',
      handler: 'TestController.postFoo'
    },
    {
      method: [ 'DELETE', 'PUT' ],
      path: '/bar',
      handler: 'TestController.updateBar'
    },
    {
      method: 'GET',
      path: '/notunique',
      handler: 'TestController.notUnique'
    }
  ]
  const testRoutesB = [
    {
      method: 'GET',
      path: '/notunique',
      handler: 'TestController.notUnique'
    },
    {
      method: 'GET',
      path: '/unique',
      handler: 'TestController.unique'
    }
  ]
  describe('#mergeTrailpackRoutes', () => {
    it('should remove duplicates', () => {
      const mergedRoutes = lib.Transformer.mergeTrailpackRoutes(testRoutesA, testRoutesB)
      assert.equal(mergedRoutes.length, 5)
    })
  })
})
