const { App } = require('@slack/bolt');
var path = require('path');
var fs = require('fs');

global.ROOT_DIR = path.resolve(__dirname);

require('dotenv').config({
  path: path.resolve(__dirname, `.env.${process.env.NODE_ENV}`)
});

const llog = require('learninglab-log');
const { noBotMessages } = require('./src/utils/ll-slack-tools/middleware')
const getAirtableConfig = require('./src/bots/config-bot/get-airtable-config')
const messageHandler = require('./src/handlers/message-handler.js');
const eventHandler = require('./src/handlers/event-handler.js');
const momentBot = require('./src/bots/moment-bot');
const openAiBot = require('./src/bots/open-ai-bot');
const everyMinuteBot = require('./src/bots/every-minute-bot')
// const slashHandler = require('./src/bots/index-bot/slash-handler.js');
// const shortcutHandler = require('./src/bots/index-bot/shortcut-handler.js');
const actionHandler = require('./src/handlers/action-handler.js');
// const handleSlateViewSubmission = require('./src/bots/slate-bot/handle-slate-view-submission');

const logRe = /^log/;
const everything = /.*/;

const app = new App({
    token: process.env.SLACK_BOT_TOKEN,
    signingSecret: process.env.SLACK_SIGNING_SECRET,
    socketMode: true,
    appToken: process.env.SLACK_APP_TOKEN,
    port: process.env.PORT || 3000
});

app.message('testing testing', messageHandler.hello);
app.message(/.*/, noBotMessages, messageHandler.parseAll);

app.command('/moment', momentBot.momentSlash);
app.command('/print-hackmd', momentBot.printHackMdSlash);

// app.event("file_shared", eventHandler.fileShared);
app.event("reaction_added", momentBot.momentReactionListener.reactionAdded);
app.event("reaction_removed", momentBot.momentReactionListener.reactionRemoved);
// app.event('pin_added', eventHandler.pinAdded);
// app.event('pin_removed', eventHandler.pinRemoved);
// app.event('app_home_opened', eventHandler.appHomeOpened);
// app.event('message', eventHandler.message);
app.event(/.*/, momentBot.momentEventListener);

app.action(everything, momentBot.momentActionListener.log);
// app.action(/atem/, actionHandler.atemButtons)
// app.action(logRe, actionHandler.liveLogger);

// app.view(/slate_submission/, handleSlateViewSubmission)

// app.shortcut(`show_your_work`, shortcutHandler.showYourWork);
// app.shortcut(/.*/, shortcutHandler.log);

(async () => {
  llog.yellow(process.env.SLACK_APP_TOKEN)
  llog.magenta(`starting app in ${process.env.NODE_ENV} mode`)
  global.BOT_CONFIG = await getAirtableConfig();
  BOT_CONFIG.channels = BOT_CONFIG.map(e => e.fields.SlackId)
  // llog.blue(BOT_CONFIG)
  await app.start(process.env.PORT || 3000);
  try {
    await app.client.chat.postMessage({
      channel: process.env.SLACK_TESTS_CHANNEL,
      text: "starting up the eventBot"
    })
    await app.client.chat.postMessage({
      channel: process.env.SLACK_TESTS_CHANNEL,
      text: `listening to these channels: ${JSON.stringify(BOT_CONFIG.map(e => e.fields.ChannelName), null, 4)}`
    })
    // uncomment for logging every minute
    // TODO: handle this by toggling in slack (hold state here; default to off)
    // everyMinuteBot.everyMinuteAction({client: app.client});
  } catch (error) {
    console.error(error)
  }
  console.log('⚡️ Bolt app is running! on port', (process.env.PORT || 3000));
})();

