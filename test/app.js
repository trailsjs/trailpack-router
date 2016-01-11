'use strict'

const _ = require('lodash')
const smokesignals = require('smokesignals')
const Model = require('trails-model')
const Controller = require('trails-controller')

module.exports = _.defaultsDeep({
  pkg: {
    name: 'waterline-trailpack-test'
  },
  api: {
    models: {
      User: class User extends Model {
        static schema () {
          return {
            name: 'string',
            roles: {
              collection: 'Role',
              via: 'user'
            }
          }
        }
      },
      Role: class Role extends Model {
        static config () {
          return {
            store: 'storeoverride'
          }
        }
        static schema () {
          return {
            name: 'string',
            user: {
              model: 'User'
            }
          }
        }
      }
    },
    controllers: {
      ClassController: class ClassController extends Controller {
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


