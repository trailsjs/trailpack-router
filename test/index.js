'use strict'

const TrailsApp = require('trails')

before(() => {
  global.app = new TrailsApp(require('./app'))
  return global.app.start().catch(err => {
    console.trace()
  })
})

after(() => {
  return global.app.stop()
})
