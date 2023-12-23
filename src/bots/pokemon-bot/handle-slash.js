const llog = require('learninglab-log');
const createFormView = require('./create-form-view');

module.exports = async ({ command, ack, say, client }) => {
    ack();
    // let sayResult = await say("working on it...")
    llog.magenta(llog.divider, "got a pokemon slash request")
    llog.gray(JSON.stringify(command, null, 4));
    try {
        const theView = await createFormView({
            user: command.user_id, 
            trigger_id: command.trigger_id,
            commandText: command.text
        })
        try {
            const result = await client.views.open(theView);
        } catch (error) {
            red(error)
        }
    } catch (error) {
        llog.red(error)
    }
}

