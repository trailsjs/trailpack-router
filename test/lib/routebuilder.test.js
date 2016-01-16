'use strict'

const _ = require('lodash')
const assert = require('assert')
const lib = require('../../lib')
const app = require('./../app')

describe('lib.RouteBuilder', () => {
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
      const mergedRoutes = lib.RouteBuilder.mergeTrailpackRoutes(testRoutesA, testRoutesB)
      assert.equal(mergedRoutes.length, 5)
    })
  })
  describe('#getControllerHandlers', () => {
    it('should compile controllers into temporary "internal" route objects', () => {
      const handlers = lib.RouteBuilder.getControllerHandlers(global.app.controllers)

      assert.equal(handlers.length, 2)
    })
    it('should compile handlers if controller is a ES6 class', () => {
      assert(_.find(global.app.routes, { handler: 'ClassController.handlerA' }))
      assert(_.find(global.app.routes, { handler: 'ClassController.handlerB' }))
    })
  })
})
