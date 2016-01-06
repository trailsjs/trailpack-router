# trailpack-router

[![NPM version][npm-image]][npm-url]
[![Build status][ci-image]][ci-url]
[![Dependency Status][daviddm-image]][daviddm-url]
[![Code Climate][codeclimate-image]][codeclimate-url]

Trailpack Router. Validates and Compiles all API endpoints (Controllers,
Policies) into [hapi.js route objects](http://hapijs.com/api#route-configuration).

## Usage
Load from your trailpack config. (This pack is included by default).

```js
// config/trailpack.js
module.exports = {
  // ...
  packs: [
    require('trailpack-core'),
    require('trailpack-router')
  ]
}
```

## Compatible Trailpacks
- [trailpack-hapi](https://github.com/trailsjs/trailpack-hapi)
- [trailpack-express4](https://github.com/trailsjs/trailpack-express4) (In Progress)
- [trailpack-koa](https://github.com/trailsjs/trailpack-koa) (TODO)

## Contributing
We love contributions! In order to be able to review your code efficiently,
please keep the following in mind:

1. Pull Requests (PRs) must include new and/or updated tests, and all tests [must pass](https://travis-ci.org/trailsjs/trailpack-router).
2. Follow the `eslintConfig` in [package.json](https://github.com/trailsjs/trailpack-router/blob/master/package.json).
3. Please [reference the relevant issue](https://github.com/blog/1506-closing-issues-via-pull-requests) in your Pull Request.

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
