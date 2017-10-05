'use strict'

const Boom = require('boom')
const Promise = require('bluebird')
const Request = require('request')
const Config = require('../config')
const Logger = require('bucker').createLogger({
  name: 'bot',
  console: Config.get('/logger/options/console')
})

const fbApiMessages = Config.get('/fbMessenger/apiMessages')
const fbApiUrl = Config.get('/fbMessenger/apiUrl')
const fbAccessToken = Config.get('/fbMessenger/accessToken')

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

const parseMessage = (request, reply) => {
  const data = request.payload

  // Make sure this is a page subscription
  if (data && data.object === 'page') {

    // Iterate over each entry - there may be multiple if batched
    data.entry.forEach((entry) => {

      // Iterate over each messaging event
      entry.messaging.forEach((event) => {
        Logger.debug('FACEBOOK MESSENGER REQUEST:', event)

        const pageID = entry.id
        const timeOfEvent = entry.time

        if (event.message && event.message.is_echo) {
          Logger.info('Ignore echo message')
          return
        }

        if (event.message) {
          receivedMessage(event)
        } else {
          Logger.error('Webhook received unknown event: ', event)
        }
      })
    })

    reply({})
  } else {
    reply(Boom.badRequest('Error page subscription'))
  }
}

// Incoming events handling
const receivedMessage = (event) => {
  const senderID = event.sender.id
  const recipientID = event.recipient.id
  const timeOfMessage = event.timestamp
  const message = event.message

  Logger.info('Received message for user %d and page %d at %d with message: %j',
    senderID, recipientID, timeOfMessage, message)

  const messageId = message.mid
  const messageText = message.text

  if (messageText) {
    sendTextMessage(senderID, messageText)
  }
}

//////////////////////////
// Sending helpers
// Templates reference: https://developers.facebook.com/docs/messenger-platform/send-api-reference/contenttypes
//////////////////////////

const sendTextMessage = (recipientId, messageText) => {
  const messageData = {
    recipient: {
      id: recipientId
    },
    message: {
      text: messageText
    }
  }

  callSendAPI(messageData)
}

const callSendAPI = (messageData) => {
  Request({
    uri: fbApiMessages,
    qs: { access_token: fbAccessToken },
    method: 'POST',
    json: messageData
  }, (error, response, body) => {
    if (!error && response.statusCode == 200) {
      var recipientId = body.recipient_id
      var messageId = body.message_id
      Logger.info('Successfully sent generic message with id %s to recipient %s', messageId, recipientId)
    } else {
      Logger.error('Unable to send message', messageData)
      Logger.error(error)
    }
  })
}

module.exports = {
  webhookValidation,
  parseMessage
}
