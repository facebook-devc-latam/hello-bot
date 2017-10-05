
Hello Bot!
===================

**Requirements**
------------
 - nodejs v6.10.0
 - [ngrok](https://ngrok.com/) (Secure tunnels to localhost)

**Installation**
----------------
Download github project and install dependencies

    git clone git@github.com:kikerios/hello-bot.git
    cd hello-bot
    npm install

Create **.env** file or clone **.env.example** in root directory

    APP_host=localhost
    APP_PORT=3500
    LOGGER_DEBUG=true
    PAGE_ACCESS_TOKEN=
    VERIFY_TOKEN=h3ll0-Bot
    FB_API_MESSAGE=https://graph.facebook.com/v2.6/me/messages
    FB_API_URL=https://graph.facebook.com/v2.6

Launch the application by running `npm start` and open http://localhost:3500 in your browser.

> hello-bot@1.0.0 start ~/hello-bot
> node server.js
> server.info: Server running at: http://localhost:3500

   Postman Collections
-------------------
| Collection | URL |
| ------ | ------ |
| Hello Bot Webhooks | https://www.getpostman.com/collections/14e5e9f8e9dba3dc4dd2 |
| Hello Bot Templates | https://www.getpostman.com/collections/2ec55a57de19c9959c8b |

with ❤ by @kikerios
