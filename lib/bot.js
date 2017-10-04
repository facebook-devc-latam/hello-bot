'use strict'

const Boom = require('boom')
const Config = require('../config')
const Logger = require('bucker').createLogger({
  name: 'bot',
  console: Config.get('/logger/options/console')
})

const webhookValidation = (requet, reply) => {

  const token = Config.get('/fbmessenger/token')

  if (requet.query['hub.mode'] === 'subscribe' && requet.query['hub.verify_token'] === token) {
    Logger.info('Validating webhook')
    reply(requet.query['hub.challenge'])
  } else {
    Logger.error('Failed validation. Make sure the validation tokens match.')
    reply(Boom.forbidden('Failed validation'))
  }
}

module.exports = {
  webhookValidation
}
