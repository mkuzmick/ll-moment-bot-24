const { yellow, magenta, blue, cyan, grey } = require(`../utilities/mk-utilities`)

module.exports = async function ({client, event }) {
    try {
        // Call views.publish with the built-in client
        const result = await client.views.publish({
          // Use the user ID associated with the event
          user_id: event.user,
          view: {
            // Home tabs must be enabled in your app configuration page under "App Home"
            "type": "home",
            "blocks": [
              {
                "type": "section",
                "text": {
                  "type": "mrkdwn",
                  "text": "I'm just a bot, standing in front of a user and asking them user me. Let me show your work, <@" + event.user + ">!"
                }
              },
              {
                "type": "section",
                "text": {
                  "type": "mrkdwn",
                  "text": "Here are a few things you can do here by clicking, but mainly, for right now at least, I'm here for you to DM stuff to. I'll create external links for all the images I see and save the rest in Airtable."
                }
              },
              {
                "type":"section",
                "text":{
                   "type":"mrkdwn",
                   "text":"A simple stack of blocks for the simple sample Block Kit Home tab."
                }
             },
             {
                "type":"actions",
                "elements":[
                   {
                      "type":"button",
                      "text":{
                         "type":"plain_text",
                         "text":"Save HackMD (under construction)",
                         "emoji":true
                      }
                   },
                   {
                      "type":"button",
                      "text":{
                         "type":"plain_text",
                         "text":"Create HackMD (under construction)",
                         "emoji":true
                      }
                   }
                ]
             }
            ]
          }
        });
        grey(result)
      }
      catch (error) {
        logger.error(error);
      }
}
