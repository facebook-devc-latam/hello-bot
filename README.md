
Hello Bot!
===================

**Requirements**
------------
 - nodejs v6.10.0
 - [ngrok](https://ngrok.com/) (Secure tunnels to localhost)

**Installation**
----------------
Download github project and install dependencies

    git clone git@github.com:devcfacebook/hello-bot.git
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

	hello-bot@1.0.0 start ~/hello-bot
	node server.js
	server.info: Server running at: http://localhost:3500

on another terminal run `ngrok command`

    ngrok http 3500

----------

    ngrok by @inconshreveable

    Session Status                online
    Update                        update available (version 2.2.8, Ctrl-U to update)
    Version                       2.2.4
    Region                        United States (us)
    Web Interface                 http://127.0.0.1:4040
    Forwarding                    http://d6f4d9ba.ngrok.io -> localhost:3500
    Forwarding                    https://d6f4d9ba.ngrok.io -> localhost:3500

next step... configure your bot

Facebook
========

**[Quick Start](https://developers.facebook.com/docs/messenger-platform/getting-started/quick-start)**
-----------------------------------
This is a walkthrough to see the basics of the platform in action. Read the [Complete Guide](https://developers.facebook.com/docs/messenger-platform/product-overview/setup) to learn about the platform in more detail.

**1. Create a Facebook App and Page**

 - Create a new [Facebook App](https://developers.facebook.com/apps) and [Page](https://www.facebook.com/pages/create) or use existing ones. Go to the App Dashboard and under Product Settings click "Add Product" and select "Messenger."
![enter image description here](https://scontent-mia3-2.xx.fbcdn.net/v/t39.2178-6/12995587_195576307494663_824949235_n.png?oh=2c4beb8b65bbe674b9d02e55baded4fb&oe=5A7C24C3)

**2. Setup Webhook**

 - In the Webhooks section, click "Setup Webhooks." 
![enter image description here](https://scontent-mia3-2.xx.fbcdn.net/v/t39.2178-6/13331609_660771177408445_306127577_n.png?oh=b2c73c9b6a96d514e26b312d507df043&oe=5A87674C)
 - Enter a **URL for a webhook**, enter a **Verify Token** and select **messages** and **messaging_postbacks** under Subscription Fields. 
![enter image description here](https://scontent-mia3-2.xx.fbcdn.net/v/t39.2178-6/12057143_211110782612505_894181129_n.png?oh=566821dc645b301f1356be2c1c7c35ef&oe=5A78B2F1)
	 - Callback URL: **(use your ngrok https url)** 
		 - https://d6f4d9ba.ngrok.io/webhook
	 - Verify Token: **(value into .env file "VERIFY_TOKEN")**
		 - h3ll0-Bot

**3. Get a Page Access Token**

 - In the Token Generation section, select your Page. A Page Access Token will be generated for you. Copy this Page Access Token. Note: The generated token will NOT be saved in this UI. Each time you select that Page a new token will be generated. However, any previous tokens created will continue to function.
![enter image description here](https://scontent-mia3-2.xx.fbcdn.net/v/t39.2178-6/12995543_1164810200226522_2093336718_n.png?oh=27f1f08c8e2ee6139f1a93d24d92aece&oe=5A476D09)
	 - Copy the **Page Access Token** and paste into **.env file "PAGE_ACCESS_TOKEN"**
	 
**4. Subscribe the App to the Page**

 - In the Webhooks section, you can subscribe the webhook for a specific page.
![enter image description here](https://scontent-mia3-2.xx.fbcdn.net/v/t39.2178-6/13421551_1702530599996541_471321650_n.png?oh=60b2566071cfb9662ce3c303d3ab3d8e&oe=5A4E859F)

**5. Restart your project**
	
    ^C
    npm start
    hello-bot@1.0.0 start ~/hello-bot
    node server.js
    server.info: Server running at: http://localhost:3500
**6. Test your bot**

 - Open your fan page and let's do magic

Postman
======

**Postman Collections**
-------------------
Import Postman Collections

 - Hello Bot Webhooks  | https://goo.gl/RWVsV9
 - Hello Bot Templates | https://goo.gl/sBdL6h 

**Postman Environment**
-------------------
Import Postman Environment

    {
      "id": "9f1a81b6-630c-c502-8fc4-cf4763d6ada0",
      "name": "hello bot environment",
      "values": [
        {
          "enabled": true,
          "key": "ngrok",
          "value": "PASTE_YOUR_NGROK_HTTPS_URL",
          "type": "text"
        },
        {
          "enabled": true,
          "key": "user_id",
          "value": "PASTE_YOUR_USER_ID",
          "type": "text"
        },
        {
          "enabled": true,
          "key": "page_id",
          "value": "PASTE_YOUR_PAGE_ID",
          "type": "text"
        },
        {
          "enabled": true,
          "key": "page_access_token",
          "value": "PASTE_YOUR_PAGE_ACCESS_TOKEN",
          "type": "text"
        }
      ],
      "timestamp": 1507163654920,
      "_postman_variable_scope": "environment",
      "_postman_exported_at": "2017-10-05T02:13:09.283Z",
      "_postman_exported_using": "Postman/5.2.1"
    }

with ❤ by [@yalochat](https://github.com/yalochat)
