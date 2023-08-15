module.exports = () => {
    return [
        {
            "type": "input",
            "element": {
                "type": "plain_text_input",
                "action_id": "plain_text_input-action"
            },
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
                "action_id": "plain_text_input-action"
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
                "action_id": "radio_buttons-action"
            },
            "label": {
                "type": "plain_text",
                "text": "Label",
                "emoji": true
            },
            "block_id": "action_temporalStatus"
        }
    ]
}