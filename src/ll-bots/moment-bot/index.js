const airtableTools = require(`../../ll-modules/ll-airtable-tools`)
const { llog } = require('../../ll-modules/ll-utilities')
const randomMoment = require('./random-moment')

const momentSlash = async ({ command, ack, client}) => {
    llog.red(llog.divider, JSON.stringify(global.BOT_CONFIG, null, 4), llog.divider)
    await ack();
    llog.cyan(
        llog.divider, 
        `a slash command has called for the momentBot`, 
        llog.divider, 
        JSON.stringify(command, null, 4), 
        llog.divider)
    let terms = command.text.split(" ");
    let uniqueTerms = [...new Set(terms)];
    var elements = []
    for (let index = 0; index < uniqueTerms.length; index++) {
        elements.push({
            "type": "button",
					"text": {
						"type": "plain_text",
						"text": uniqueTerms[index],
						"emoji": true
					},
					"value": `log_${uniqueTerms[index]}`,
					"action_id": `log_action_${uniqueTerms[index]}`
        })   
    }
    const blocks = [
        {
            "type": "image",
            "image_url": randomMoment(),
            "alt_text": "a moment"
        },
        {
            "type": "header",
            "text": {
                "type": "plain_text",
                "text": `here's your moment logger`,
                "emoji": true
            }
        },
        {
            "type": "section",
            "text": {
                "type": "mrkdwn",
                "text": `if you want to add moments from words, click the buttons`
            }
        },
        {
			"type": "actions",
			"elements": elements
		}
    ]
    
    try {
        const result = await client.chat.postMessage({
            channel: command.channel_id,
            text: "if you see this, the logging machine can't work in this context",
            blocks: blocks
        })
        llog.magenta(result)
        let theRecord = {
            SlackTs: result.ts,
            UserId: command.user_id || "NA",
            SlackChannelId: command.channel_id || "NA" ,
            SlackCommandJSON: JSON.stringify(command, null, 4),
            SlackMessageJSON: JSON.stringify(result, null, 4)
        }
        let theResult = await airtableTools.addRecord({
            baseId: process.env.AIRTABLE_MOMENTS_BASE,
            table: "SlackMomentSlashSessions",
            record: theRecord
        })
        return(theResult)
    } catch (error) {
        llog.red(`couldn't post message in response to moment slash`, error )
    }
    


}

const momentEventToAirtable = async (event) => {
    let theRecord = {
        EventType: event.type,
        UserId: event.user || "NA",
        SlackChannelId: (event.item && event.item.channel) || "NA" ,
        SlackEventTs: event.event_ts,
        SlackJSON: JSON.stringify(event, null, 4)
    }
    let theResult = await airtableTools.addRecord({
        baseId: process.env.AIRTABLE_MOMENTS_BASE,
        table: "SlackEvents",
        record: theRecord
    })
    llog.cyan(result)

}

const momentMessageToAirtable = async (message) => {
    let theRecord = {
        SlackTs: message.ts,
        Text: message.text || "",
        UserId: message.user,
        SlackChannel: message.channel,
        SlackJSON: JSON.stringify(message, null, 4)
    }
    let theResult = await airtableTools.addRecord({
        baseId: process.env.AIRTABLE_MOMENTS_BASE,
        table: "SlackMessages",
        record: theRecord
    })
    return(theResult)
}

const momentReactionToAirtable = async (event) => {
    let theRecord = {
        EventType: event.type,
        UserId: event.user,
        Reaction: event.reaction,
        OriginalItemTs: event.item.ts,
        SlackChannelId: event.item.channel,
        OriginalItemType: event.item.type,
        OriginalItemUser: event.item_user,
        SlackEventTs: event.event_ts,
        SlackJSON: JSON.stringify(event, null, 4)
    }
    let theResult = await airtableTools.addRecord({
        baseId: process.env.AIRTABLE_MOMENTS_BASE,
        table: "SlackReactions",
        record: theRecord
    })
    return(`finished momentMessageToAirtable`)
}


module.exports.momentSlash = momentSlash
module.exports.momentMessageToAirtable = momentMessageToAirtable
module.exports.momentReactionToAirtable = momentReactionToAirtable
module.exports.momentEventToAirtable = momentEventToAirtable