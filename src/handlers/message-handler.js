const llog= require('learninglab-log')
// add this logic back in somewhere to handle links
const { resourceFromMessageLink } = require(`../bots/resource-bot`);
const makeGif = require(`../bots/gif-bot/make-gif`);
const momentBot = require(`../bots/moment-bot`)
const huntResponse = require('../bots/open-ai-bot/hunt-response-1')
exports.hello = async ({ message, say }) => {
    // say() sends a message to the channel where the event was triggered
    await say(`the bot is running, <@${message.user}>!`);
}

exports.rocket = async ({ message, say }) => {
    await say(`thanks for the :rocket:, <@${message.user}>`);
}

exports.parseAll = async ({ client, message, say }) => {
    llog.magenta(`parsing all messages, including this one from ${message.channel}`)
    if (BOT_CONFIG.channels.includes(message.channel)) {
        llog.blue(`handling message because ${message.channel} is one of \n${JSON.stringify(BOT_CONFIG.channels, null, 4)}`)
        llog.yellow(message)
        const result = await momentBot.momentMessageListener(message);
        llog.blue(result)
    } else if ( message.channel_type == "im" ) {
        llog.magenta(`handling message because ${message.channel} is a DM`)
        llog.yellow(message)
        let result = await client.conversations.history({channel: message.channel, limit: 10})
        llog.magenta(result)
        let openAiResult = await huntResponse({ text: message.text, messages: result.messages });
        llog.magenta(openAiResult)
        let slackResult = await say(openAiResult.choices[0].message.content);
    } else {
        llog.magenta(`some other message we aren't handling now--uncomment message-handler line 27 to get the json`)
        llog.blue(`message wasn't in array ${JSON.stringify(BOT_CONFIG.channels, null, 4)}`)
        llog.yellow(message)
    }
}

