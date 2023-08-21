const airtableTools = require(`../../ll-modules/ll-airtable-tools`)
const { llog } = require('../../ll-modules/ll-utilities')

exports.reactionAdded = async ({event}) => {
    llog.yellow(`got a reactionAdded: ${event.type}:`)
    llog.cyan(event)
    if (BOT_CONFIG.channels.includes(event.item.channel)) {
      llog.blue(`handling message because ${event.item.channel} is one of \n${JSON.stringify(BOT_CONFIG.channels, null, 4)}`)
      llog.yellow(event)
      let theRecord = {
            EventType: event.type || "",
            UserId: event.user  || "",
            Reaction: event.reaction  || "",
            OriginalItemTs: event.item.ts  || "",
            SlackChannelId: event.item.channel  || "",
            OriginalItemType: event.item.type  || "",
            OriginalItemUser: event.item_user  || "",
            SlackEventTs: event.event_ts  || "",
            SlackJSON: JSON.stringify(event, null, 4)
        }
        let theResult = await airtableTools.addRecord({
            baseId: process.env.AIRTABLE_MOMENTS_BASE,
            table: "SlackReactions",
            record: theRecord
        })
        llog.blue(theResult)
        return(`finished momentMessageToAirtable`)
    } else {
        llog.magenta(`some other event we aren't handling now`)
        llog.blue(`event channel wasn't in array ${JSON.stringify(BOT_CONFIG.channels, null, 4)}`)
        llog.yellow(event)
    }
    
}

  
exports.reactionRemoved = async ({ event }) => {
    llog.yellow(`got a reactionRemoved ${event.type}:`)
    llog.cyan(event)
}


