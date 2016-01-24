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
  describe('#getRoutePath', () => {
    it('should generate correct path for typical use case', () => {
      assert.equal(lib.Footprints.getRoutePath([ 'foo', 'bar' ]), '/foo/bar')
    })
    it('should generate correct path for boundary case', () => {
      assert.equal(lib.Footprints.getRoutePath('/'), '/')
    })
    it('should generate correct path when given leading and trailing slashes', () => {
      assert.equal(lib.Footprints.getRoutePath([ 'foo', '/bar' ]),   '/foo/bar')
      assert.equal(lib.Footprints.getRoutePath([ '/foo', 'bar' ]),   '/foo/bar')
      assert.equal(lib.Footprints.getRoutePath([ '/foo', '/bar' ]),  '/foo/bar')
      assert.equal(lib.Footprints.getRoutePath([ 'foo/', '/bar' ]),  '/foo/bar')
      assert.equal(lib.Footprints.getRoutePath([ 'foo', '/bar/' ]),  '/foo/bar')
      assert.equal(lib.Footprints.getRoutePath([ '/foo/', '/bar/' ]),'/foo/bar')
      assert.equal(lib.Footprints.getRoutePath([ '/foo/', 'bar' ]),  '/foo/bar')

      assert.equal(lib.Footprints.getRoutePath([ '/foo//', '/baz/', '//bar/' ]),'/foo/baz/bar')
    })
    it('should generate correct path when given hapi path params', () => {
      assert.equal(lib.Footprints.getRoutePath([ 'foo', '/{model}/{id?}' ]),   '/foo/{model}/{id?}')
      assert.equal(lib.Footprints.getRoutePath([ 'foo', '/{model}/{id?}/' ]),   '/foo/{model}/{id?}')
      assert.equal(lib.Footprints.getRoutePath([ 'foo', '{model}/{id?}' ]),   '/foo/{model}/{id?}')
    })
    it('should generate correct path when given an array with one element', () => {
      assert.equal(lib.Footprints.getRoutePath([ 'foo/bar' ]),   '/foo/bar')
      assert.equal(lib.Footprints.getRoutePath([ '/foo/bar/' ]),   '/foo/bar')
      assert.equal(lib.Footprints.getRoutePath([ '/foo//bar/' ]),   '/foo/bar')
    })
    it('should generate correct path when given a raw string', () => {
      assert.equal(lib.Footprints.getRoutePath('foo/bar'),   '/foo/bar')
    })
    it('should generate correct path when given regular arguments', () => {
      assert.equal(lib.Footprints.getRoutePath('foo', 'bar'),   '/foo/bar')
      assert.equal(lib.Footprints.getRoutePath('/foo', '/bar'),   '/foo/bar')
    })
    it('should generate correct path when given unlikely craziness', () => {
      assert.equal(lib.Footprints.getRoutePath('foo', [ 'bar', [ 'baz/boo///' ] ]), '/foo/bar/baz/boo')
    })
    it('should fail if unparseable inputs are provided', () => {
      assert.throws(() => lib.Footprints.getRoutePath(function () { }), TypeError)
    })
    it('should fail if no arguments provided', () => {
      assert.throws(() => lib.Footprints.getRoutePath(), TypeError)
    })
    it('should fail if falsy arguments provided', () => {
      assert.throws(() => lib.Footprints.getRoutePath(null), TypeError)
      assert.throws(() => lib.Footprints.getRoutePath(''), TypeError)
      assert.throws(() => lib.Footprints.getRoutePath(undefined), TypeError)
      assert.throws(() => lib.Footprints.getRoutePath(false), TypeError)
      assert.throws(() => lib.Footprints.getRoutePath([ false, null ]), TypeError)
    })
  })

})
