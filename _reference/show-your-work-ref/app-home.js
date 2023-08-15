const { findRecordByValue, findRecordById } = require('../ll-modules/utilities/airtable-tools')
const { red, magenta, gray, yellow, blue, divider } = require('../ll-modules/utilities/mk-loggers')

module.exports = async ({ event, client, logger }) => {
    try {
      // Call views.publish with the built-in client
      try {
        const personResult = await findRecordByValue({
          baseId: process.env.AIRTABLE_22_23_BASE,
          table: "Users",
          field: "SlackId",
          value: event.user,
          // view: "MAIN"
        })
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
                  "text": "*Welcome home, <@" + event.user + "> :house:*"
                }
              },
              {
                "type": "section",
                "text": {
                  "type": "mrkdwn",
                  "text": `looked for ${event.user}\n\`\`\`${JSON.stringify(personResult.fields, null, 4).substring(0, 1000)}\`\`\``
                }
              }
            ]
          }
        });
        // logger.info(result);
      } catch (error) {
        
      }
    }
    catch (error) {
      logger.error(error);
    }
  }