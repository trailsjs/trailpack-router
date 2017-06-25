require('trails')

module.exports = {
  pkg: {
    name: 'router-trailpack-test'
  },
  api: {
    controllers: {
      TestController: class TestController extends Controller {
        foo () { }
        bar () { }
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
        handler: 'FooController.bar',
        config: {
          pre: [
            'FooPolicy.bar'
          ]
        }
      },
      {
        method: 'GET',
        path: '/node_modules',
        handler: {
          directory: {
            path: 'node_modules'
          }
        }
      },
      {
        method: 'GET',
        path: '/test/foo/tags',
        handler: 'TestController.foo',
        config: {
          tags: ['test', 'other']
        }
      }
    ]
  }
}
