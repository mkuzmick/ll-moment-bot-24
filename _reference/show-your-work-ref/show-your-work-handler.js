const { yellow, gray, darkgray, red, cyan, blue, magenta, divider } = require("../ll-modules/utilities/mk-loggers")
const airtableTools = require('../ll-modules/utilities/airtable-tools')
// const makeGif = require('../make-gif')

module.exports = async ({ message, client, say }) => {
    magenta(`handling post in show-your-work`)
    // say(`we'll show that, ${message.user}`)
    // yellow(message)
    if (message.files) {
        magenta(`handling attachment`)
        var publicResult
        // make all of these checks regexes
        if (["mp4", "mov"].includes(message.files[0].filetype)) {
            // if (message.files[0].size < 50000000) {
            //     const gifResult = await makeGif({
            //         file: message.files[0],
            //         client: client,
            //     })
            //     magenta(gifResult)
            // }
        } else {
            publicResult = await client.files.sharedPublicURL({
                token: process.env.SLACK_USER_TOKEN,
                file: message.files[0].id,
            }).catch(err=>red(err));
            cyan(publicResult)
            const theRecord = {
                baseId: process.env.AIRTABLE_22_23_BASE,
                table: "ShowYourImages",
                record: {
                    "Id": `${message.files[0].name}-${message.event_ts}`,
                    "Title": message.files[0].title,
                    "FileName": message.files[0].name,
                    "SlackFileInfoJson": JSON.stringify(message.files[0], null, 4),
                    // "SlackFileInfoJSON": JSON.stringify(fileInfo, null, 4),
                    "ImageFiles": [
                        {
                        "url": makeSlackImageURL(message.files[0].permalink, message.files[0].permalink_public)
                        }
                    ],
                    "SlackUrl": makeSlackImageURL(message.files[0].permalink, message.files[0].permalink_public),
                    "PostedBySlackUser": message.files[0].user,
                    "SlackTs": message.event_ts
                }
            }
            magenta(divider)
            cyan(theRecord)
            const airtableResult = await airtableTools.addRecord(theRecord) 
            cyan(airtableResult)
            const mdPostResult = await client.chat.postMessage({
                channel: message.channel,
                thread_ts: message.ts,
                unfurl_media: false,
                unfurl_links: false,
                parse: "none",
                text: `here's the markdown for embedding the image: \n\`\`\`![alt text](${makeSlackImageURL(message.files[0].permalink, message.files[0].permalink_public)})\`\`\``
            })
        }
    }
}


function makeSlackImageURL (permalink, permalink_public) {
    let secrets = (permalink_public.split("slack-files.com/")[1]).split("-")
    let suffix = permalink.split("/")[(permalink.split("/").length - 1)]
    let filePath = `https://files.slack.com/files-pri/${secrets[0]}-${secrets[1]}/${suffix}?pub_secret=${secrets[2]}`
    return filePath
}
  




// module.exports = async ({ message, client, say }) => {
//     magenta(`got something in show your work`)
//     grey(message)
//     try {
//         const airtableResult = await airtableTools.addRecord({
//             baseId: process.env.AIRTABLE_SHOW_BASE,
//             table: "ShowYourWorks",
//             record: {
//                 "SlackTs": message.ts,
//                 "MessageJson": JSON.stringify(message, null, 4),
//                 "UserId": message.user,
//                 "Text": message.text ? message.text : ""
//             }
//         })
//         // TODO: parse and find more elements to send to other tables
//         if (
//             // message.blocks
//             // && message.blocks[0].elements
//             // && message.blocks[0].elements[0].elements && 
//             message.blocks[0].elements[0].elements[0].type == "link") {
//             magenta(divider)
//             cyan(`link: ${message.blocks[0].elements[0].elements[0].url}`)
//         }
//     } catch (error) {
//         magenta(error)
//     }
//     return("done")
// }




