'use strict'

const _ = require('lodash')
const smokesignals = require('smokesignals')

module.exports = _.defaultsDeep({
  pkg: {
    name: 'router-trailpack-test'
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

    }
  }
}, smokesignals.FailsafeConfig)

