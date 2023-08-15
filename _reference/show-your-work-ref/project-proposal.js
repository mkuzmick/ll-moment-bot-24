const { findRecordByValue, findRecordById } = require('../ll-modules/utilities/airtable-tools')
const { magenta, gray, yellow, blue, divider, red } = require('../ll-modules/utilities/mk-loggers')

module.exports = async ({ command, client, say, ack }) => {
    await ack()
    red(`user ${command.user_id} has requested hackmd 1\n${JSON.stringify(command, null, 4)}`)
    await say(`OK <@${command.user_id}>, let's get that hackMD. I may send it to you in your DMs.`)
    await client.chat.postMessage({text: "not ready to do that just yet", channel: command.user_id})
}