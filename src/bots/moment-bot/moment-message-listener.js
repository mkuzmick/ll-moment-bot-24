const airtableTools = require('../../utils/ll-airtable-tools')
const llog = require('learninglab-log')

const momentMessageListener = async (message) => {
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

module.exports = momentMessageListener