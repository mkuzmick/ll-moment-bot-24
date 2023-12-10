const llog= require('learninglab-log')
// add this logic back in somewhere to handle links
const { resourceFromMessageLink } = require(`../bots/resource-bot`);
const makeGif = require(`../bots/gif-bot/make-gif`);
const momentBot = require(`../bots/moment-bot`)
const huntResponse = require('../bots/open-ai-bot/hunt-response-1')


const bots = [
    {
        name: "gif-bot",
        trigger: "file",
        channel_ids: ["C06995V5N94"],
        image: "https://files.slack.com/files-pri/T0HTW3H0V-F063L8594N5/mkll_02138_a_bot_version_of_shakespeare_realistic_closeup_c3af60d3-3f31-4cff-a8a9-94ec517a8d76.png?pub_secret=353634cc30",
        function: async ({ client, message, say }) => { 
            llog.blue("got gif-bot request", message)
            await say("gif-bot will respond")
        }
    },
    {
        name: "director-bot",
        trigger: "name",
        channel_ids: ["C06995V5N94"],
        image: "https://files.slack.com/files-pri/T0HTW3H0V-F063L8594N5/mkll_02138_a_bot_version_of_shakespeare_realistic_closeup_c3af60d3-3f31-4cff-a8a9-94ec517a8d76.png?pub_secret=353634cc30",
        function: async ({ client, message, say }) => {
            llog.blue("got director-bot request", message)
            const slackResult = await client.chat.postMessage({
                channel: message.channel,
                // text: chatResponse.choices[0].message.content,
                text: "the Director will respond",
                icon_url: "https://files.slack.com/files-pri/T0HTW3H0V-F063L8594N5/mkll_02138_a_bot_version_of_shakespeare_realistic_closeup_c3af60d3-3f31-4cff-a8a9-94ec517a8d76.png?pub_secret=353634cc30",
                username: "Director"
                // text: "got some text, but saving secretly in the console"
    
            });
        }
    }
]


exports.hello = async ({ message, say }) => {
    // say() sends a message to the channel where the event was triggered
    await say(`the bot is running, <@${message.user}>!`);
}

exports.rocket = async ({ message, say }) => {
    await say(`thanks for the :rocket:, <@${message.user}>`);
}

exports.parseAll = async ({ client, message, say }) => {
    llog.magenta(`parsing all messages, including this one from ${message.channel}`)
    for (let i = 0; i < bots.length; i++) {
        let bot = bots[i]
        if (bot.trigger == "file") {
            try {
                if (bot.channel_ids.includes(message.channel)) {
                    await bot.function({ client, messay, say })
                }
            } catch (error) {
                console.error(error)
            }
        } else if (bot.trigger == "name") {
            if (message.text.toLowerCase().includes(bot.name.toLowerCase())) {
                // Your code here
                if (bot.channel_ids.includes(message.channel)) {
                    await bot.function({ client, message, say })
                }
            }
            
            
        }

        if (bots[i].channel === message.channel) {
            llog.blue(`handling message because ${message.channel} is one of \n${JSON.stringify(BOT_CONFIG[i].channel, null, 4)}`)
            llog.yellow(message)
            // Call the corresponding function
            const result = await BOT_CONFIG[i].function(message);
            llog.blue(result)
            // Removed return statement
        }
    }

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
