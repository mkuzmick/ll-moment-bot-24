const airtableTools = require(`../../ll-modules/ll-airtable-tools`)
const { llog } = require('../../ll-modules/ll-utilities')

const momentEventListener =  async (event) => {
    let theRecord = {
        EventType: event.type,
        UserId: event.user || "NA",
        SlackChannelId: (event.item && event.item.channel) || (event.channel) || "NA" ,
        SlackEventTs: event.event_ts,
        SlackJSON: JSON.stringify(event, null, 4)
    }
    let theResult = await airtableTools.addRecord({
        baseId: process.env.AIRTABLE_MOMENTS_BASE,
        table: "SlackEvents",
        record: theRecord
    })
    llog.cyan(theResult)

}

module.exports = momentEventListener