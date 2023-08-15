const { yellow, grey, red, cyan, blue, magenta, divider } = require("../utilities/mk-utilities")
const airtableTools = require(`../utilities/airtable-tools`)

module.exports = async ({ message, client, say }) => {
    magenta(`got something in show your work`)
    grey(message)
    try {
        const airtableResult = await airtableTools.addRecord({
            baseId: process.env.AIRTABLE_SHOW_BASE,
            table: "ShowYourWorks",
            record: {
                "SlackTs": message.ts,
                "MessageJson": JSON.stringify(message, null, 4),
                "UserId": message.user,
                "Text": message.text ? message.text : ""
            }
        })
        // TODO: parse and find more elements to send to other tables
        if (
            // message.blocks
            // && message.blocks[0].elements
            // && message.blocks[0].elements[0].elements && 
            message.blocks[0].elements[0].elements[0].type == "link") {
            magenta(divider)
            cyan(`link: ${message.blocks[0].elements[0].elements[0].url}`)
        }
    } catch (error) {
        magenta(error)
    }
    return("done")
}
