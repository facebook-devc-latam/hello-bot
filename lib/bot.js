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
    reply({challenge:request.query['hub.challenge']})
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

        let pageID = entry.id
        let timeOfEvent = entry.time

        if(event.message && event.message.is_echo) {
          Logger.info('Ignore echo message')
          return
        }

        if (event.message) {
          receivedMessage(event)
        } else if (event.postback) {
          receivedPostback(event)
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

  var senderID = event.sender.id
  var recipientID = event.recipient.id
  var timeOfMessage = event.timestamp
  var message = event.message

  Logger.info('Received message for user %d and page %d at %d with message:', senderID, recipientID, timeOfMessage)
  Logger.info(JSON.stringify(message))

  var messageId = message.mid

  var messageText = message.text
  var messageAttachments = message.attachments

  if (messageText) {
    // If we receive a text message, check to see if it matches a keyword
    // and send back the template example. Otherwise, just echo the text we received.
    switch (messageText) {

      case 'hi':
      case 'hello':
        getUser(senderID).then(userData => {
          sendTextMessage(senderID, `${messageText} ${userData.first_name}`)
        }).catch(error => {
          sendTextMessage(senderID, `hello friend`)
        })

        break

      case 'card':
      case 'generic':
        sendGenericMessage(senderID)
        break

      default:
        sendTextMessage(senderID, messageText)
    }
  } else if (messageAttachments) {
    sendTextMessage(senderID, 'Message with attachment received')
  }
}

const receivedPostback = (event) => {

  var senderID = event.sender.id
  var recipientID = event.recipient.id
  var timeOfPostback = event.timestamp

  // The 'payload' param is a developer-defined field which is set in a postback
  // button for Structured Messages.
  var payload = event.postback.payload

  Logger.info('Received postback for user %d and page %d with payload "%s" ' +'at %d', senderID, recipientID, payload, timeOfPostback)

  // When a postback is called, we'll send a message back to the sender to
  // let them know it was successful
  sendTextMessage(senderID, `Postback called (${payload})`)
}

//////////////////////////
// Sending helpers
//////////////////////////

const sendTextMessage = (recipientId, messageText) => {

  var messageData = {
    recipient: {
      id: recipientId
    },
    message: {
      text: messageText
    }
  }

  callSendAPI(messageData)
}

const sendGenericMessage = (recipientId) => {

  var messageData = {
    recipient: {
      id: recipientId
    },
    message: {
      attachment: {
        type: 'template',
        payload: {
          template_type: 'generic',
          elements: [{
            title: 'Yalo Chat',
            subtitle: 'Home Page',
            item_url: 'https://www.yalochat.com/',
            image_url: 'https://static.xx.fbcdn.net/rsrc.php/v3/yv/r/9Ng3cDrKdPZ.png',
            buttons: [
              {
                type: 'web_url',
                url: 'https://www.yalochat.com/',
                title: 'Open Web URL'
              }, {
                type: 'postback',
                title: 'Call Postback',
                payload: 'Payload for first bubble',
              }
            ],
          }, {
            title: 'Yalo Chat',
            subtitle: 'Interactúa con WhatsApp',
            item_url: 'https://www.yalochat.com/promo',
            image_url: 'https://daks2k3a4ib2z.cloudfront.net/596d4104caac727fda24d6b4/59add50dc31dc00001f37ee1_promo-phone.png',
            buttons: [
              {
              type: 'web_url',
              url: 'https://www.yalochat.com/promo',
              title: 'Open Web URL'
              }, {
                type: 'postback',
                title: 'Call Postback',
                payload: 'Payload for second bubble',
              }
            ]
          }]
        }
      }
    }
  }

  callSendAPI(messageData)
}

const getUser = (userId) => {

  return new Promise((resolve, reject) => {

    const apiUrl = `${fbApiUrl}/${userId}`
    Logger.debug(`Get user for bot hello-bot from URL: ${apiUrl}`)

    Request({
      uri: apiUrl,
      qs: { access_token: fbAccessToken },
      method: 'GET'
    }, (error, response, body) => {
      if (!error && response.statusCode == 200) {
        var userData = JSON.parse(body)
        Logger.info('User Data', userData)
        resolve(userData)
      } else {
        Logger.error(error)
        reject(error)
      }
    })

  })
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
