const { blue, yellow, cyan, magenta, grey } = require('../utilities/mk-utilities')
const airtableTools = require(`../utilities/airtable-tools`)
  
exports.log = async ({ ack, body, client }) => {
    await ack()
    magenta(`action body:`)
    grey(body)
}
