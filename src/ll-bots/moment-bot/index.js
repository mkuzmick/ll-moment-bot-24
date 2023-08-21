const airtableTools = require(`../../ll-modules/ll-airtable-tools`)
const { llog } = require('../../ll-modules/ll-utilities')
const randomMoment = require('./random-moment')

const momentEventListener = require(`./moment-event-listener`)
const momentSlash = require('./moment-slash')
const momentMessageListener = require('./moment-message-listener')

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


const parseAll = async ({ event }) => {
    const handledEvents = ["message","reaction_added", "reaction_removed", "app_home_opened", "file_shared"]
    if (handledEvents.includes(event.type)) {
      llog.blue(`got an event of type ${event.type}, handling this elsewhere`)
      // magenta(event)
    } else {
      llog.yellow(`currently unhandled event of type ${event.type}:`)
      llog.cyan(JSON.stringify(event))
    }
    llog.red(event)
    const result = await momentEventListener(event)
}
  
  

module.exports.momentSlash = momentSlash
module.exports.momentMessageToAirtable = momentMessageToAirtable
module.exports.momentReactionToAirtable = momentReactionToAirtable
module.exports.momentEventListener = momentEventListener
module.exports.parseAll = parseAll
module.exports.momentMessageListener = momentMessageListener