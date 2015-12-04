const joi = require('joi')

module.exports = joi.object().keys({
  method: joi.alternatives().try(
    joi.string(),
    joi.array()
  ),
  path: joi.string().required(),
  handler: joi.alternatives().try(
    joi.func(),
    joi.string()
  ),
  vhost: joi.string(),
  cache: joi.object().keys({
    privacy: joi.string(),
    expiresIn: joi.any(),
    expiresAt: joi.any(),
    statuses: joi.array()
  }),
  config: joi.object().keys({
    description: joi.string(),
    notes: joi.string(),
    tags: joi.string(),
    handler: joi.alternatives().try(
      joi.func(),
      joi.string()
    ),
    cors: joi.alternatives().try(
      joi.boolean(),
      joi.object().keys({
        origin: joi.array(),
        maxAge: joi.number(),
        headers: joi.array(),
        additionalHeaders: joi.array(),
        exposedHeaders: joi.array(),
        additionalExposedHeaders: joi.array(),
        credentials: joi.boolean()
      })
    ),
    ext: joi.object(),
    files: joi.object().keys({
      relativeTo: joi.string()
    }),
    id: joi.string(),
    isInternal: joi.boolean(),
    json: joi.object(),
    jsonp: joi.any(),
    payload: joi.any(),
    plugins: joi.object(),
    pre: joi.array(),
    security: joi.object(),
    state: joi.object(),
    validate: joi.object(),
    timeout: joi.object(),

    response: joi.object(),
    auth: joi.alternatives().try(
      joi.boolean(),
      joi.string(),
      joi.object().keys({
        mode: joi.string(),
        strategies: joi.array(),
        payload: joi.any(),
        scope: joi.alternatives().try(
          joi.string(),
          joi.array()
        ),
        entity: joi.string()
      })
    ),
    bind: joi.object()
  })
})
