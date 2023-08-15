const { findRecordByValue, findRecordById, findManyByValue } = require('../../ll-modules/airtable-tools')
const { red, magenta, gray, yellow, blue, divider } = require('../../ll-modules/utilities/ll-loggers')

module.exports = async ({ event, client, logger }) => {
    try {
      // Call views.publish with the built-in client
      try {
        let options = {
          baseId: process.env.AIRTABLE_WORK_BASE,
          table: "Tasks",
          field: "AssignedTo_SlackId",
          value: event.user,
          view: "NOT_DONE"
        }
        blue(options)
        const personResult = await findManyByValue(options)
        magenta(divider, personResult, divider)
        let docLinks = "\n\n"
        for (let i = 0; i < personResult.length; i++) {
          const element = personResult[i];
          if (element.fields.WorkingDoc) {
            docLinks+=`- <${element.fields.WorkingDoc}|${element.fields.Title}>\n`
          }
        }

        let blx = [
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
              "text": `*your docs:*\n${docLinks.substring(0, 5000)}`
            }
          }
        ]
        const result = await client.views.publish({
          // Use the user ID associated with the event
          user_id: event.user,
          view: {
            // Home tabs must be enabled in your app configuration page under "App Home"
            "type": "home",
            "blocks": blx
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