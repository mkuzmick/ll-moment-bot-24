const { yellow, grey, red, cyan, blue, magenta, divider } = require("../utilities/mk-utilities")
const airtableTools = require(`../utilities/airtable-tools`)
const cheerio = require(`cheerio`)
const axios = require(`axios`)
const ogs = require('open-graph-scraper');


module.exports = async ({ message, client, say }) => {
    magenta(`got something in show your links`)
    grey(message)
    const theLinks = []
    try {
        for (let i = 0; i < message.blocks.length; i++) {
            const block = message.blocks[i];
            for (let j = 0; j < block.elements.length; j++) {
                const element = block.elements[j];
                for (let k = 0; k < element.elements.length; k++) {
                    const subelement = element.elements[k];
                    if (subelement.type == "link") {
                        theLinks.push(subelement.url)
                    }
                }
            }
        }
        for (let i = 0; i < theLinks.length; i++) {
              const element = theLinks[i];
              let ogData = await getOgData(element);
              const airtableResult = await airtableTools.addRecord({
                    baseId: process.env.AIRTABLE_SHOW_BASE,
                    table: "ShowYourLinks",
                    record: {
                        "URL": element,
                        "Title": ogData.ogTitle,
                        "Description": ogData.ogDescription,
                        "OgImageLink": ogData.ogImage.url,
                        "OgImage": [
                            {
                            "url": ogData.ogImage.url,
                            }
                        ],
                        "SlackTs": message.ts,
                        "SlackJson": JSON.stringify(message, null, 4),
                        "SlackUser": message.user,
                    }
                })
          }
    } catch (error) {
        console.log(`error in show your links loop`);
    }
    

    // try {
    //     
    //     // TODO: parse and find more elements to send to other tables
    // } catch (error) {
    //     magenta(error)
    // }
    return("done")
}

// async function getLinkData(url) {
//     try {
//       const { data } = await axios.get(url);
//       const $ = cheerio.load(data);
//       let result = {
//         title: $('title').text(),
//         body: $('body').text(),
//         ogImage: $('meta[property="og:title"]').attr('content')
//         }   
//       return result
//     } catch (err) {
//       console.error(err);
//     }
// }

async function getOgData (url) {
    const result = await ogs({url: url, downloadLimit: 5000000})
        .then((data) => {
            const { error, result, response } = data;
            console.log('error:', error);  // This returns true or false. True if there was an error. The error itself is inside the results object.
            console.log('result:', result); // This contains all of the Open Graph results
            // console.log('response:', response); // This contains the HTML of page
            return (result)
        })
    return (result)
}




