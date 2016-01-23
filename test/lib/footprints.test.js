const assert = require('assert')
const _ = require('lodash')
const lib = require('../../lib')

describe('lib.Footprints', () => {
  describe('#getRouteIdFromHandler', () => {
    it('should generate a correct route id from an internal "handler" object', () => {
      const expectedRouteId = '[footprint] /default/info -> DefaultController.info'
      const handlerObject = {
        controllerName: 'DefaultController',
        controllerId: 'default',
        handlerName: 'info'
      }

      const id = lib.Footprints.getRouteIdFromHandler(
        handlerObject, 'footprint', global.app.config)

      assert.equal(id, expectedRouteId)
    })
    it('should include prefix, if specified', () => {
      const expectedRouteId = '[footprint] /123/default/info -> DefaultController.info'
      const handlerObject = {
        controllerName: 'DefaultController',
        controllerId: 'default',
        handlerName: 'info'
      }
      const config = _.defaultsDeep({ footprints: { prefix: '123' } }, global.app.config)
      const id = lib.Footprints.getRouteIdFromHandler(handlerObject, 'footprint', config)

      assert.equal(id, expectedRouteId)
    })
  })
  describe.skip('#getRouteIdFromRoute', () => {
    it('should generate a route id from a hapijs route object', () => {

    })
    it('should generate unique ids for similar routes', () => {

    })

  })
})
