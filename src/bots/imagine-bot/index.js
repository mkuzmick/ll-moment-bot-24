const llog = require('learninglab-log')
const OpenAI = require("openai");
const axios = require('axios');
const fs = require('fs');
const path = require('path');
const imagineBotIcon = "https://files.slack.com/files-pri/T0HTW3H0V-F06980PK5S8/guy-tiled.jpg?pub_secret=347a4fe478"

const generateImage = async (prompt) => {
    try {
        const openai = new OpenAI({
            apiKey: process.env.OPENAI_API_KEY, 
        });
        const openAiResult = await openai.images.generate({
            model: "dall-e-3",
            prompt: prompt,
            n: 1,
            // size: "1024x1792",
            quality: "hd",
            size: "1024x1024",
        });
        // llog.yellow(openAiResult)
        return({
            imageUrl: openAiResult.data[0].url,
            openAiResult: openAiResult
        })
    } catch (error) {
        llog.red(error)
    }
}

const downloadFile = async (fileUrl, fileName) => {
    const response = await axios({
      url: fileUrl,
      responseType: 'stream',
    });
  
    return new Promise((resolve, reject) => {
      response.data
        .pipe(fs.createWriteStream(fileName))
        .on('finish', () => resolve())
        .on('error', e => reject(e));
    });
};

const uploadFileToSlack = async (fileName, channelId, client, newPrompt) => {
    llog.blue('uploading', fileName, channelId, newPrompt)
    try {
        // Call the files.upload method using the WebClient
        const result = await client.files.upload({
        // const result = await client.files.uploadV2({
            // channels can be a list of one to many strings
            channels: channelId,
            // channel_id: channelId,
            fileName: path.basename(fileName),
            // filetype: "png",
            title: "your image",
            initial_comment: `OpenAI made your image, but the prompt was changed to "${newPrompt}"`,
            // Include your filename in a ReadStream here
            file: fs.createReadStream(fileName),
        });
        llog.blue(result);
    } catch (error) {
        console.error(error);
    }
    return result
};

  

module.exports = async ({ command, ack, say, client }) => {
    ack();
    let sayResult = await say("working on it...")
    llog.magenta(llog.divider, "got a imagine slash request")
    llog.gray(JSON.stringify(command, null, 4));
    let image = await generateImage(command.text);
    llog.magenta(image)
    try {
        let fileName = `openai-image-${Date.now()}.png`
        await downloadFile(image.imageUrl, fileName);
        let uploadResult = await uploadFileToSlack(fileName, command.channel_id, client, image.openAiResult.data[0].revised_prompt);
        let slackResult = await client.chat.postMessage({
            channel: command.channel_id,
            text: `hope that worked`,
            icon_url: imagineBotIcon,
            username: "Imagine Bot"
        })
    } catch (error) {
        llog.red(error)
    }
}