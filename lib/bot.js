'use strict'

const Boom = require('boom')
const Promise = require('bluebird')
const Request = require('request')
const Config = require('../config')
const Logger = require('bucker').createLogger({
  name: 'bot',
  console: Config.get('/logger/options/console')
})

const webhookValidation = (request, reply) => {
  const token = Config.get('/fbMessenger/token')
  if (request.query['hub.mode'] === 'subscribe' && request.query['hub.verify_token'] === token) {
    Logger.info('Validating webhook')
    reply(request.query['hub.challenge'])
  } else {
    Logger.error('Failed validation. Make sure the validation tokens match.')
    reply(Boom.forbidden('Failed validation'))
  }
}

module.exports = {
  webhookValidation
}
