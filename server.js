'use strict'

const Hapi = require('hapi')
const Config = require('./config')
const Logger = require('bucker').createLogger({
  name: 'server',
  console: Config.get('/logger/options/console')
})

const Bot = require('./lib/bot')

// Create a server with a host and port
const server = new Hapi.Server()
server.connection({
    host: Config.get('/app/host'),
    port: Config.get('/app/port')
})

// Add the route
server.route({
    method: 'GET',
    path:'/',
    handler: function (request, reply) {

        return reply('hello bot')
    }
})

// Webhook validation
server.route({
    method: 'GET',
    path:'/webhook',
    handler: Bot.webhookValidation
})

// Message processing
server.route({
    method: 'POST',
    path:'/webhook',
    handler: Bot.parseMessage
})

// Start the server
server.start((err) => {

    if (err) {
        throw err
    }
    Logger.info('Server running at:', server.info.uri)
})
