'use strict'

const _ = require('lodash')
const smokesignals = require('smokesignals')

module.exports = _.defaultsDeep({
  pkg: {
    name: 'waterline-trailpack-test'
  },
  api: {
    models: {
      User: {
        attributes: {
          name: 'string',
          roles: {
            collection: 'Role',
            via: 'user'
          }
        }
      },
      Role: {
        store: 'storeoverride',
        attributes: {
          name: 'string',
          user: {
            model: 'User'
          }
        }
      }
    },
    controllers: {
      ClassController: class ClassController {
        handlerA () {
          return 1
        }
        handlerB () {
          return 2
        }
      }
    }
  },
  config: {
    main: {
      packs: [
        smokesignals.Trailpack,
        require('trailpack-core'),
        require('../') // trailpack-router
      ]
    },
    footprints: {
      controllers: true
    }
  }
}, smokesignals.FailsafeConfig)


