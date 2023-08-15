const { findRecordByValue, findRecordById, addRecord } = require('../ll-modules/utilities/airtable-tools')
const { magenta, gray, yellow, blue, divider, red, darkgray } = require('../ll-modules/utilities/mk-loggers')
// const modalNewActionBlocks = require('./blocks/modal-new-action')

module.exports = async ({ command, client, say, ack }) => {
    await ack()
    darkgray(`user ${command.user_id} has requested a new action 1\nhere's the command:\n${JSON.stringify(command, null, 4)}`)
    const theView = await createView({
        user: command.user_id, 
        trigger_id: command.trigger_id,
        commandText: command.text
    })
    try {
        const result = await client.views.open(theView);
    } catch (error) {
        red(error)
    }
}

const createView = ({ user, trigger_id, commandText }) => {    
    const theView = {
        trigger_id: trigger_id,
        view: {
          type: 'modal',
          callback_id: 'action_submission',
          title: {
            type: 'plain_text',
            text: 'New Action'
          },
          "blocks": [
            {
                "type": "input",
                "element": {
                    "type": "plain_text_input",
                    "action_id": "plain_text_input-action",
                    "initial_value": commandText.substring(0, 53)                },
                "label": {
                    "type": "plain_text",
                    "text": "Title",
                    "emoji": true
                },
                "block_id": "action_title"
            },
            {
                "type": "input",
                "element": {
                    "type": "plain_text_input",
                    "multiline": true,
                    "action_id": "plain_text_input-action",
                    "initial_value": commandText
                },
                "label": {
                    "type": "plain_text",
                    "text": "Description",
                    "emoji": true
                },
                "block_id": "action_description"
            },
            {
                "type": "input",
                "element": {
                    "type": "radio_buttons",
                    "options": [
                        {
                            "text": {
                                "type": "plain_text",
                                "text": "someday",
                                "emoji": true
                            },
                            "value": "Someday"
                        },
                        {
                            "text": {
                                "type": "plain_text",
                                "text": "this term",
                                "emoji": true
                            },
                            "value": "ThisTerm"
                        },
                        {
                            "text": {
                                "type": "plain_text",
                                "text": "this month",
                                "emoji": true
                            },
                            "value": "ThisMonth"
                        },
                        {
                            "text": {
                                "type": "plain_text",
                                "text": "this week",
                                "emoji": true
                            },
                            "value": "ThisWeek"
                        },
                        {
                            "text": {
                                "type": "plain_text",
                                "text": "today",
                                "emoji": true
                            },
                            "value": "Today"
                        }
                    ],
                    "action_id": "radio_buttons-action",
                    "initial_option": {
                        "text": {
                            "type": "plain_text",
                            "text": "today",
                            "emoji": true
                        },
                        "value": "Today"
                    }
                },
                "label": {
                    "type": "plain_text",
                    "text": "When?",
                    "emoji": true
                },
                "block_id": "action_temporalStatus"
            },
            {
                "type": "input",
                "element": {
                    "type": "multi_users_select",
                    "placeholder": {
                        "type": "plain_text",
                        "text": "Select users",
                        "emoji": true
                    },
                    "action_id": "multi_users_select-action",
                    "initial_users": user ? [user] : []
                },
                "label": {
                    "type": "plain_text",
                    "text": "Assigned To",
                    "emoji": true
                },
                "block_id": "assigned_to"
            }
        ],
        submit: {
            type: 'plain_text',
            text: 'Submit'
          }
        }
      }
      return theView
}