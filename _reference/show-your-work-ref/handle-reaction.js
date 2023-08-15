const { red, blue, cyan, gray, darkgray, divider, magenta, yellow } = require('../ll-modules/utilities/mk-loggers')

module.exports = async ({ event, context, client }) => {
    yellow(`got a reactionAdded: ${event.type}:`)
    cyan(event)
    // const theOptions = {
    //   baseId: process.env.AIRTABLE_SHOW_BASE,
    //   table: "Reactions",
    //   record: {
    //       "EmojiId": event.reaction,
    //       "EventTs": event.event_ts,
    //       "UserId": event.user,
    //       "ItemTs": event.item.ts,
    //       "ItemChannel": event.item.channel,
    //       "ItemType": event.item.type,
    //       "ItemUser": event.item_user,
    //       "EventJson": JSON.stringify(event)
    //   }
    // }
    if (event.reaction == "camera") {
        yellow('got a camera')
        client.chat.postMessage({
            channel: event.user,
            "blocks": [
                {
                    "type": "image",
                    "title": {
                        "type": "plain_text",
                        "text": "dani desk plan",
                        "emoji": true
                    },
                    "image_url": "https://files.slack.com/files-pri/T0HTW3H0V-F03QCAC7DHT/00000000_202.gif?pub_secret=a33b693903",
                    "alt_text": "marg"
                },
                {
                    "type": "section",
                    "text": {
                        "type": "mrkdwn",
                        "text": "This is an image we'd like know more about."
                    },
                    "accessory": {
                        "type": "button",
                        "text": {
                            "type": "plain_text",
                            "text": "Click Me to Update",
                            "emoji": true
                        },
                        "value": "image-update",
                        "action_id": "button-action"
                    }
                }
            ],
            text: "text"
            
        })
    } else {
        yellow(`that's a reaction we aren't handling in any special way`)
    }

    
    // const airtableResult = await airtableTools.addRecord(theOptions) 
  }