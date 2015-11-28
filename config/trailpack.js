/**
 * Trailpack Configuration
 *
 * This manifest declares the application resources which are provided and/or
 * modified by this trailpack.
 */
module.exports = {

  name: 'router',

  pkg: require('../package'),

  /**
   * Define the API resources are provided by this trailpack
   */
  provides: {
    app: [
      'routes'
    ],
    controllers: [
      'FootprintController'
    ],
    config: [
      'footprints',
      'server'
    ],
    models: false,
    policies: false
  },

  /**
   * Define the API resources modified/extended by this trailpack
   */
  modifies: {

  }

}
