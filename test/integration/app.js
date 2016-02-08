'use strict'

const _ = require('lodash')
const smokesignals = require('smokesignals')
const Controller = require('trails-controller')
const Policy = require('trails-policy')

module.exports = _.defaultsDeep({
  pkg: {
    name: 'router-trailpack-test'
  },
  api: {
    controllers: {
      TestController: class TestController extends Controller {
        foo () { }
      },
      HomeController: class HomeController extends Controller {
        index () { }
      },
      FooController: class FooController extends Controller {
        bar () { }
      }
    },
    policies: {
      FooPolicy: class FooPolicy extends Policy {
        bar () { }
      }
    }
  },
  config: {
    main: {
      packs: [
        //smokesignals.Trailpack,
        require('trailpack-core'),
        require('../../') // trailpack-router
      ]
    },
    routes: [
      {
        method: 'GET',
        path: '/test/foo',
        handler: 'TestController.foo'
      },
      {
        method: [ 'GET', 'POST' ],
        path: '/',
        handler: 'HomeController.index'
      },
      {
        method: '*',
        path: '/foo/bar',
        handler: 'FooController.bar'
      }
    ],
    policies: {
      FooController: {
        bar: [ 'FooPolicy.bar' ]
      }
    }
  }
}, smokesignals.FailsafeConfig)

