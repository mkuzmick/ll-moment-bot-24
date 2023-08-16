const { blue, yellow, cyan, magenta, gray } = require('../../ll-modules/ll-utilities/mk-utilities')
// add this logic back in somewhere to handle links
const { resourceFromMessageLink } = require(`../resource-bot`);
const makeGif = require(`../gif-bot/make-gif`);
const momentBot = require(`../moment-bot`)

exports.hello = async ({ message, say }) => {
    // say() sends a message to the channel where the event was triggered
    await say(`the bot is running, <@${message.user}>!`);
}

exports.rocket = async ({ message, say }) => {
    await say(`thanks for the :rocket:, <@${message.user}>`);
}

exports.parseAll = async ({ message, say }) => {
    magenta(`parsing all messages, including this one from ${message.channel}`)
    if (BOT_CONFIG.channels.includes(message.channel)) {
        blue(`handling message because ${message.channel} is one of \n${JSON.stringify(BOT_CONFIG.channels, null, 4)}`)
        yellow(message)
        const result = await momentBot.momentMessageToAirtable(message);
        blue(result)
    } else {
        magenta(`some other message we aren't handling now--uncomment message-handler line 27 to get the json`)
        blue(`message wasn't in array ${JSON.stringify(BOT_CONFIG.channels, null, 4)}`)
        yellow(message)
    }
}

