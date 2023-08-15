app.js code

```
const { App } = require('@slack/bolt');
const { blue, darkgray, gray, magenta, yellow, divider, red } = require('./src/ll-modules/utilities/ll-loggers')
// const { projectProposal, projectHackMd,  } = require(`./src/show-tools`)
const { appHome, newTaskView, handleMessage, newLaunchView, handleTaskViewSubmission, handleLaunchViewSubmission, newDelegateView, handleDelegateViewSubmission } = require('./src/the-bot')
const mw = require('./src/ll-modules/slack-tools/slack-middleware')
// const handleReaction = require('./src/show-tools/handle-reaction')
const { everything } = require('./src/ll-modules/utilities/ll-regex');

require('dotenv').config()

// Initializes your app with your bot token and signing secret
const app = new App({
    token: process.env.SLACK_BOT_TOKEN,
    signingSecret: process.env.SLACK_SIGNING_SECRET,
    socketMode: true, // add this
    appToken: process.env.SLACK_APP_TOKEN // add this
});

app.message(/.*/, mw.noBot, handleMessage.parseAllNonBot);

app.view(/task_submission/, handleTaskViewSubmission);
app.view(/launch_submission/, handleLaunchViewSubmission)
app.view(/delegate_submission/, handleDelegateViewSubmission)

app.view(/.*/, async ({ body, view, ack }) => { 
    ack();
    yellow('got any view')
    darkgray(divider, "view", divider)
    darkgray(divider, "view", view)
    darkgray(divider, "view", divider)
    darkgray(divider, "body", body)
});

// app.event("reaction_added", handleReaction);
app.event('app_home_opened', appHome);
app.event(/.*/, async ({ event }) => { darkgray(event) });

app.action(everything, async ({ payload, context, body, ack }) => {
    await ack();
    yellow(divider, `ACTION`, divider)
    magenta(divider, `ACTION PAYLOAD`, divider, payload);
    magenta(divider, `ACTION BODY`, divider, body);
});

// app.command("/projectproposal", projectProposal);
// app.command("/projecthackmd", projectHackMd);
app.command("/task", newTaskView);
app.command("/launch", newLaunchView);
app.command("/delegate", newDelegateView);

(async () => {
    // let's load up the cache and reference JSON
    // all users
    // all emojis
    // all workerprops
    // Start your app
    await app.start(process.env.PORT || 3000);
    red('⚡️ Bolt app is running!');
})();
```