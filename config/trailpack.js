/**
 * Trailpack Configuration
 *
 * This manifest declares the application resources which are provided and/or
 * modified by this trailpack.
 */
module.exports = {

  /**
   * Define the API resources are provided by this trailpack
   */
  provides: {
    controllers: [
      'FootprintController'
    ],
    config: [
      'footprints',
      'server'
    ]
  }

}
