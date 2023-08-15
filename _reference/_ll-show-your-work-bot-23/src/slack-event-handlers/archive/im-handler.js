const { cyan, magenta, yellow, blue, grey, red, divider, wait, isValidUrl } = require("../../utilities/mk-utilities");
const airtableTools = require(`../../utilities/airtable-tools`);

module.exports = async ({ message, client, say }) => {
    if (message.channel_type == "im") {
        yellow(divider)
        yellow(`got an im from a user to show-your-work:`)
        yellow(message)
        if (!message.subtype) {
            try {
                const airtableResult = await airtableTools.addRecord({
                    baseId: process.env.AIRTABLE_SHOW_BASE,
                    table: "Slacks",
                    record: {
                        "SlackTs": message.ts,
                        "MessageJson": JSON.stringify(message, null, 4),
                        "UserId": message.user,
                        "Text": message.text ? message.text : ""
                    }
                })
                if (
                    // message.blocks
                    // && message.blocks[0].elements
                    // && message.blocks[0].elements[0].elements && 
                    message.blocks[0].elements[0].elements[0].type == "link") {
                    magenta(divider)
                    cyan(`link: ${message.blocks[0].elements[0].elements[0].url}`)
                }
            } catch (error) {
                magenta(error)
            }
            try {
                blue(divider)
                const urls = lookForUrls(message)
                magenta(`the urls:\n${urls}`)
                const records = []
                for (let i = 0; i < urls.length; i++) {
                    records.push({
                        fields: {
                            URL: urls[i],
                            Notes: "to be added"
                        }
                    })
                }
                const atResult = await airtableTools.addRecords({
                    baseId: process.env.AIRTABLE_SHOW_BASE,
                    table: "Links",
                    records: records
                })
                blue(`added to airtable`)
                grey(atResult)
            } catch (error) {
                console.log(`error with lookForUrls`);
            }
        } else if (message.subtype == "message_changed") {
            // wait a second?
            // await wait(1000);
            // try {
            //     const airtableResult = await airtableTools.addRecord({
            //         baseId: process.env.AIRTABLE_SHOW_BASE,
            //         table: "Slacks",
            //         record: {
            //             "SlackTs": message.ts,
            //             "MessageJson": JSON.stringify(message, null, 4),
            //             "UserId": message.user
            //         }
            //     })
            // } catch (error) {
            //     red(error)
            // }
        } else if (message.subtype == "file_share") {
            await handleImageInIm({message: message, client: client, say: say})
        }
    } else if (message.channel_type == "mpim") {
        grey(`parsing all ims and mpims for now`)
        grey(message)
    } else {
        console.error(`message channel_type unexpected.`)
    }  
}


function lookForUrls(message) {
    const urls = []
    message.blocks.forEach(outerEl => {
        console.log(`checking`);
        blue(outerEl)
        if (outerEl.elements) {
            outerEl.elements.forEach(innerEl => {
                magenta(innerEl)
                if (innerEl.elements) {
                    innerEl.elements.forEach(el => {
                        yellow(`checking`)
                        yellow(el)
                        if (el.type=="link") {
                            yellow(`got a link: ${el.url}`)
                            magenta(urls)
                            urls.push(el.url)
                        }
                    })
                }
            })
        }
    })
    return urls
}

async function handleImageInIm ({ message, client, say }) {
    magenta(divider)
    yellow(`got a file share request in a DM`)
    grey(message)
    try {
        const handledImageFiles = ["image/gif", "image/jpeg", "image/jpg", "image/png"]
        const fileInfo = await client.files.info({
          file: message.files[0].id,
        });
        yellow(`handing ${message.files[0].id} from im, here's the fileInfo;`)
        cyan(fileInfo)
        if (handledImageFiles.includes(fileInfo.file.mimetype) ) {
            magenta({
                token: process.env.SLACK_USER_TOKEN,
                file: message.files[0].id
            })
            let makePublicResult = await client.files.sharedPublicURL({
                token: process.env.SLACK_USER_TOKEN,
                file: message.files[0].id
            })
            const mdPostResult = await say(`posted a photo! ${makeSlackImageURL(fileInfo.file.permalink, fileInfo.file.permalink_public)}.\n\nhere's your markdown:\n\`\`\`![alt text](${makeSlackImageURL(fileInfo.file.permalink, fileInfo.file.permalink_public)})\`\`\``)
        } else {
          yellow(`we aren't ready to handle files of this type yet: handling ${fileInfo.file.name} with ext ${path.extname(fileInfo.file.name)}`)
        }
      } catch (error) {
        yellow(`eventHandler.fileShared failed`)
        console.error(error)
      }
}


function makeSlackImageURL (permalink, permalink_public) {
    let secrets = (permalink_public.split("slack-files.com/")[1]).split("-")
    let suffix = permalink.split("/")[(permalink.split("/").length - 1)]
    let filePath = `https://files.slack.com/files-pri/${secrets[0]}-${secrets[1]}/${suffix}?pub_secret=${secrets[2]}`
    return filePath
  }