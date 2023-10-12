const { App } = require('@slack/bolt');
var path = require('path');

global.ROOT_DIR = path.resolve(__dirname);

require('dotenv').config();

const llog = require('./src/ll-modules/ll-utilities/ll-logs')
const { noBotMessages } = require('./src/ll-modules/ll-slack-tools/middleware')
const getAirtableConfig = require('./src/ll-bots/config-bot/get-airtable-config')
const messageHandler = require('./src/ll-bots/index-bot/message-handler.js');
const eventHandler = require('./src/ll-bots/index-bot/event-handler.js');
const momentBot = require('./src/ll-bots/moment-bot');
const openAiBot = require('./src/ll-bots/open-ai-bot');
const everyMinuteBot = require('./src/ll-bots/every-minute-bot')
// const slashHandler = require('./src/ll-bots/index-bot/slash-handler.js');
// const shortcutHandler = require('./src/ll-bots/index-bot/shortcut-handler.js');
const actionHandler = require('./src/ll-bots/index-bot/action-handler.js');
// const handleSlateViewSubmission = require('./src/ll-bots/slate-bot/handle-slate-view-submission');

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
app.command('/llaitest', )

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
    everyMinuteBot.everyMinuteAction({client: app.client});
  } catch (error) {
    console.error(error)
  }
  console.log('⚡️ Bolt app is running! on port', (process.env.PORT || 3000));
})();

