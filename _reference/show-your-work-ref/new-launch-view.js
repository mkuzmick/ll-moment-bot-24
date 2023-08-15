const { findRecordByValue, findRecordById, addRecord } = require('../ll-modules/utilities/airtable-tools')
const { magenta, gray, yellow, blue, divider, red, darkgray } = require('../ll-modules/utilities/mk-loggers')
// const modalNewActionBlocks = require('./blocks/modal-new-action')

module.exports = async ({ command, client, say, ack }) => {
    await ack()
    darkgray(`user ${command.user_id} has requested a new launch 1\n${JSON.stringify(command, null, 4)}`)
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
          callback_id: 'launch_submission',
          title: {
            type: 'plain_text',
            text: 'Launch'
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
                "block_id": "project_title"
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
                "block_id": "project_description"
            },
            {
                "type": "input",
                "element": {
                    "type": "radio_buttons",
                    "options": [
                        {
                            "text": {
                                "type": "plain_text",
                                "text": "project",
                                "emoji": true
                            },
                            "value": "Project"
                        },
                        {
                            "text": {
                                "type": "plain_text",
                                "text": "lookbook",
                                "emoji": true
                            },
                            "value": "Lookbook"
                        },
                        {
                            "text": {
                                "type": "plain_text",
                                "text": "workshop",
                                "emoji": true
                            },
                            "value": "Workshop"
                        },
                        {
                            "text": {
                                "type": "plain_text",
                                "text": "resource",
                                "emoji": true
                            },
                            "value": "Resource"
                        },
                        {
                            "text": {
                                "type": "plain_text",
                                "text": "other",
                                "emoji": true
                            },
                            "value": "Other"
                        }
                    ],
                    "action_id": "radio_buttons-action",
                    "initial_option": {
                        "text": {
                            "type": "plain_text",
                            "text": "project",
                            "emoji": true
                        },
                        "value": "Project"
                    }
                },
                "label": {
                    "type": "plain_text",
                    "text": "When?",
                    "emoji": true
                },
                "block_id": "project_type"
            },
            {
                "type": "input",
                "element": {
                    "type": "multi_users_select",
                    "placeholder": {
                        "type": "plain_text",
                        "text": "Select collaborators",
                        "emoji": true
                    },
                    "action_id": "multi_users_select-action",
                    "initial_users": user ? [user] : []
                },
                "label": {
                    "type": "plain_text",
                    "text": "Collaborators",
                    "emoji": true
                },
                "block_id": "collaborators"
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