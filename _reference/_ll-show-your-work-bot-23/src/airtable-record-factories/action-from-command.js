const airtableTools = require(`../utilities/airtable-tools`)
const { yellow, blue, cyan, magenta, grey } = require(`../utilities/mk-utilities`)

module.exports = async function (command) {
    magenta(`starting actionFromCommand`)
    grey(command)
    const result = await airtableTools.addRecord({
        baseId: process.env.AIRTABLE_SHOW_BASE,
        table: "Actions",
        record: {
            Name: command.text,
            CreatedBySlackId: command.user_id
        }
    })
    blue(result)
    return (result)
}