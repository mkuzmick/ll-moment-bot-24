const { cyan, magenta, yellow, blue, gray, darkgray, divider, red } = require("../ll-modules/utilities/mk-loggers");
// const resourceFromMessageLink = require(`../airtable-record-factories/resource-from-message-link`)
// const showYourImagesHandler = require(`./show-your-images-handler`)
const showYourWorkHandler = require(`./show-your-work-handler`)
// const showYourLinksHandler = require(`./show-your-links-handler`)

exports.hello = async ({ message, client, say }) => {
    blue(message)
    // say() sends a message to the channel where the event was triggered
    await say(`Hey there <@${message.user}>!`);
}

exports.rocket = async ({ message, client, say }) => {
    await say(`thanks for the :rocket:, <@${message.user}>`);
}

exports.parseAllNonBot = async ({ message, client, say }) => {
    magenta(`parsing all non-bot messages`)
    darkgray(message)
    if (message.channel == process.env.SLACK_SHOW_YOUR_WORK_CHANNEL) {
        yellow(`work`)
        let result = await showYourWorkHandler({ message: message, say: say, client: client })
    } 
    
    // else if (message.channel == process.env.SLACK_SHOW_YOUR_LINKS_CHANNEL) {
    //     yellow(`link`)
    //     await showYourLinksHandler({ message: message, say: say, client: client })
    // } else if (message.channel == process.env.SLACK_SHOW_YOUR_IMAGES_CHANNEL) {
    //     yellow(`image`)
    //     // magenta(message)
    //     await showYourImagesHandler({ message: message, client: client, say: say })
    // } 
    
    else {
        yellow(`this isn't work, images or links--not handling for now`)
        gray(message)
    }
}