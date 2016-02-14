# trailpack-router

[![Gitter][gitter-image]][gitter-url]
[![NPM version][npm-image]][npm-url]
[![Build status][ci-image]][ci-url]
[![Dependency Status][daviddm-image]][daviddm-url]
[![Code Climate][codeclimate-image]][codeclimate-url]
[![Follow @trailsjs on Twitter][twitter-image]][twitter-url]

Trailpack Router. Aggregates all routes from `config.routes` and attaches
prerequisites (Policies) to form [hapi.js route objects](http://hapijs.com/api#route-configuration).

## Usage
Load from your trailpack config. (This pack is included by default).

```js
// config/main.js
module.exports = {
  // ...
  packs: [
    require('trailpack-core'),
    require('trailpack-router')
  ]
}
```

## Configure

#### `config.policies`
The policies configuration maps controller handlers to a list of policies
which must pass before the handler is invoked.

```js
// config/policies.js
module.exports = {
  ExampleController: {
    test: [ 'ExamplePolicy.test' ]
  }
}
```

#### `config.routes`
The list of route objects to be compiled for use by the webserver.

```js
// config/routes.js
module.exports = [
  {
    method: [ 'GET' ],
    path: '/example/test',
    handler: 'ExampleController.test'
  }
]
```

During initialization, for the above example, a route object will be compiled
that takes the following form:

```js
  {
    method: [ 'GET' ],
    path: '/example/test',
    handler: 'ExampleController.test',
    config: {
      pre: [ 'ExamplePolicy.test' ]
    }
  }
```

## Compatible Trailpacks
- [trailpack-hapi](https://github.com/trailsjs/trailpack-hapi)
- [trailpack-express4](https://github.com/trailsjs/trailpack-express4) (In Progress)
- [trailpack-koa](https://github.com/trailsjs/trailpack-koa) (TODO)

## Contributing
We love contributions! Please see our [Contribution Guide](https://github.com/trailsjs/trails/blob/master/CONTRIBUTING.md)
for more information.

## License
[MIT](https://github.com/trailsjs/trailpack-router/blob/master/LICENSE)

[npm-image]: https://img.shields.io/npm/v/trailpack-router.svg?style=flat-square
[npm-url]: https://npmjs.org/package/trailpack-router
[ci-image]: https://img.shields.io/travis/trailsjs/trailpack-router/master.svg?style=flat-square
[ci-url]: https://travis-ci.org/trailsjs/trailpack-router
[daviddm-image]: http://img.shields.io/david/trailsjs/trailpack-router.svg?style=flat-square
[daviddm-url]: https://david-dm.org/trailsjs/trailpack-router
[codeclimate-image]: https://img.shields.io/codeclimate/github/trailsjs/trailpack-router.svg?style=flat-square
[codeclimate-url]: https://codeclimate.com/github/trailsjs/trailpack-router
[gitter-image]: http://img.shields.io/badge/+%20GITTER-JOIN%20CHAT%20%E2%86%92-1DCE73.svg?style=flat-square
[gitter-url]: https://gitter.im/trailsjs/trails
[twitter-image]: https://img.shields.io/twitter/follow/trailsjs.svg?style=social
[twitter-url]: https://twitter.com/trailsjs
