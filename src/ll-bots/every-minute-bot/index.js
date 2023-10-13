var chokidar = require('chokidar');
const { llog } = require('../../ll-modules/ll-utilities')
const path = require('path')
const OpenAI = require("openai");
const { spawnSync } = require('child_process');
const fs = require("fs");

function extractDateTimeFromPath(path) {
    const match = path.match(/(\d{4}-\d{2}-\d{2}-\d{2}-\d{2}-\d{2})\.mov$/);
    
    if (match) {
        const [year, month, day, hour, minute, second] = match[1].split('-').map(Number);
        // Note: month in JavaScript is 0-based (0 = January, 11 = December)
        return new Date(year, month - 1, day, hour, minute, second);
    }
    return null;
}

function hasTimeElapsed(path, timeInMilliseconds) {
    const fileDateTime = extractDateTimeFromPath(path);
    
    if (fileDateTime) {
        const currentTime = new Date();
        const elapsedTime = currentTime - fileDateTime;

        return elapsedTime > timeInMilliseconds;
    }
    return false;
}

const transcribeFile = async function (options) {
    const openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY, 
    });


    let start = new Date().getTime(); // Get current time in milliseconds
    
    let filePath = options.filePath; // Assuming you pass the file path in the options

    // 1. Check file extension
    if (!/\.(mov|MOV|mp4|m4v)$/.test(filePath)) {
        throw new Error("Unsupported file format");
    }

    // 2. Convert video file to audio-only using ffmpeg
    let outputFilePath = path.join(
        path.dirname(filePath),
        path.basename(filePath, path.extname(filePath)) + ".m4a"
    );

    let result = spawnSync('ffmpeg', ['-i', filePath, '-vn', '-b:a', '48k', outputFilePath]);
    if (result.error) {
        throw result.error;
    }



    const transcription = await openai.audio.transcriptions.create({
        file: fs.createReadStream(outputFilePath),
        model: "whisper-1",
    });
    
    console.log(transcription.text);

    // Save the transcription to .json and .txt
    let baseNameWithoutExtension = path.basename(filePath, path.extname(filePath));
    let transcriptionJsonPath = path.join(path.dirname(filePath), baseNameWithoutExtension + ".json");
    let transcriptionTxtPath = path.join(path.dirname(filePath), baseNameWithoutExtension + ".txt");

    fs.writeFileSync(transcriptionJsonPath, JSON.stringify(transcription, null, 4));
    fs.writeFileSync(transcriptionTxtPath, transcription.text);

    let stop = new Date().getTime();
    let durationInMilliseconds = stop - start; 
    console.log(`Request took ${durationInMilliseconds} milliseconds`);

    return ({ text: transcription.text });
}

const everyMinuteAction = async ({client}) => {
    var watcher = chokidar.watch(process.env.OBS_CAPTURE_FOLDER, {ignored: /\.DS_Store/, persistent: true, awaitWriteFinish: true});
    watcher
        .on('add', async function(file) {
            console.log('File', file, 'has been added');
            if (path.extname(file) == ".mov") {
                llog.yellow(file, "is a movie and was added")
                
        
                if (hasTimeElapsed(file, (1 * 60 + 10) * 1000)) { // 1 minute and 10 seconds in milliseconds
                    console.log(`More than 1 minute has elapsed since the video timestamp.`);
                } else {
                    console.log('Less than 1 minute has elapsed since the video timestamp.');
                }
                
            } else {
                console.log(`some other file: ${file}`)
            }
        })
        .on('change', async function(file) {
            if (path.extname(file) == ".mov") {
                llog.yellow(file, "is a movie and just changed")
                
        
                if (hasTimeElapsed(file, (1 * 60) * 1000)) { // 1 minute and 10 seconds in milliseconds
                    console.log(`More than 1 minute has elapsed since the video timestamp.`);
                    console.log('File', file, 'has been changed');
                    const transcriptionResult = await transcribeFile({ filePath: file })
                    llog.magenta(transcriptionResult)
                    llog.blue(transcriptionResult.text)
                    const frenchResult = await frenchResponse(transcriptionResult.text)
                    const slackResult = await client.chat.postMessage({
                        channel: process.env.SLACK_EVERY_MINUTE_IN_FRENCH_CHANNEL,
                        text: frenchResult.choices[0].message.content
                    })
                } else {
                    console.log('Less than 1 minute has elapsed since the video timestamp.');
                }

                
            } else {
                console.log(`some other file changed: ${file}`)
            }
            
        })
        .on('unlink', function(file) {console.log('File', file, 'has been removed');})
        .on('error', function(error) {console.error('Error happened', error);})
}

const frenchResponse = async ( text ) => {
    const openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY, 
      });


    let promptMessages = [
        { 
            role: 'system', 
            content: `you are an AI assistant who is a stylish French speaker. You translate everything into perfect French.` 
        }, 
        {
            role: "user",
            content: `please translate this into French, removing excessively repeated words: ${text}`
        }
    ]

    llog.cyan("promptMessage", promptMessages)

    let chatCompletion = await openai.chat.completions.create({
        messages: promptMessages,
        model: 'gpt-3.5-turbo',
    });
    return chatCompletion;
}

module.exports.everyMinuteAction = everyMinuteAction


