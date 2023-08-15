const { findRecordByValue, findRecordById, addRecord } = require('../../ll-modules/airtable-tools')
const { magenta, gray, yellow, blue, divider, red, darkgray } = require('../../ll-modules/utilities/ll-loggers')
// const modalNewActionBlocks = require('./blocks/modal-new-action')

module.exports = async ({ command, client, say, ack }) => {
    await ack()
    darkgray(`user ${command.user_id} has requested a new task to delegate 1\n${JSON.stringify(command, null, 4)}`)
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
          callback_id: 'delegate_submission',
          title: {
            type: 'plain_text',
            text: 'Delegate This'
          },
          "blocks": [
            {
                "type": "input",
                "element": {
                    "type": "plain_text_input",
                    "action_id": "plain_text_input-task",
                    "initial_value": commandText.substring(0, 53)                },
                "label": {
                    "type": "plain_text",
                    "text": "Title",
                    "emoji": true
                },
                "block_id": "task_title"
            },
            {
                "type": "input",
                "element": {
                    "type": "plain_text_input",
                    "multiline": true,
                    "action_id": "plain_text_input-task",
                    "initial_value": commandText
                },
                "label": {
                    "type": "plain_text",
                    "text": "Description",
                    "emoji": true
                },
                "block_id": "task_description"
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
                                "text": "tomorrow",
                                "emoji": true
                            },
                            "value": "Tomorrow"
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
                    "action_id": "radio_buttons-task",
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
                "block_id": "task_temporalStatus"
            },
            {
                "type": "section",
                "text": {
                    "type": "mrkdwn",
                    "text": "Choose the channels or individuals that best correspond to the `AvailableFor` field"
                },
                "accessory": {
                    "type": "multi_conversations_select",
                    "placeholder": {
                        "type": "plain_text",
                        "text": "Select conversations",
                        "emoji": true
                    },
                    "action_id": "AvailableFor"
                },
                "block_id": "available_for"
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