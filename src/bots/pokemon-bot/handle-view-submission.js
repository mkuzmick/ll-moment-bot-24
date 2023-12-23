const llog = require('learninglab-log')
const OpenAI = require("openai");
const axios = require('axios');
const fs = require('fs');
const path = require('path');
const pokemonBotIcon = "https://files.slack.com/files-pri/T0HTW3H0V-F069XBVK6GP/elle.l.studio_pikachu_on_a_white_background_9c17635e-ea6e-47af-a191-95af2681a39d.jpg?pub_secret=27b8f2167e"
const createFormView = require('./create-form-view')


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




module.exports = async ({ ack, body, view, client }) => {
    // Acknowledge the view_submission request
    ack();
    llog.blue(llog.divider, "pokemon view submission", view);
    llog.yellow(llog.divider, "pokemon view submission body", body);
    let image = await generateImage(`please generate an image of a pokemon character called ${view.state.values.pokemon_name.pokemon_text_input_name.value} on a white background that matches the following user prompt: ${view.state.values.pokemon_description.pokemon_text_input_description.value}`);
    llog.magenta(image)

    try {
        let fileName = `openai-image-${Date.now()}.png`
        await downloadFile(image.imageUrl, fileName);
        let uploadResult = await uploadFileToSlack(fileName, process.env.SLACK_POKEMON_CHANNEL, client, image.openAiResult.data[0].revised_prompt);
       
        let slackResult = await client.chat.postMessage({
            channel: process.env.SLACK_POKEMON_CHANNEL,
            text: `hope that worked`,
            icon_url: pokemonBotIcon,
            username: "Pokemon Bot"
        })
    } catch (error) {
        llog.red(error)

    }

}





// visionresponse = client.chat.completions.create(
//   model="gpt-4-vision-preview",
//   messages=[
//     {
//       "role": "user",
//       "content": [
//         {"type": "text", "text": "Describe this image. Be specific about the characters physical and mental attributes, like how strong and smart it may be, as well as how tall it may be."},
//         {
//           "type": "image_url",
//           "image_url": {
//             "url": imageresponse.data[0].url,
//           },
//         },
//       ],
//     }
//   ],
//   max_tokens=2000,
// )

// visionresponse_text = visionresponse.choices[0].message.content
// wrapped_text = textwrap.fill(visionresponse_text, width=80)

// print(wrapped_text)

// import json

// user_messages = [{"role": "user", "content": f"Generate stats for a pokemon named {name} with this description: {desc}, and a physical description here: {visionresponse_text} If you do not know certain quantities, then just guess."}]
// tools = [
//     {
//         "type": "function",
//         "function": {
//             "name": "add_record",
//             "description": "Add a new pokemon record to a table",
//             "parameters": {
//                 "type": "object",
//                 "properties": {
//                     "name": {
//                         "type": "string",
//                         "description": "The name of the Pokemon",
//                     },
//                     "desc": {
//                         "type": "string",
//                         "description": "Description of the Pokemon",
//                     },
//                     "height": {
//                         "type": "number",
//                         "description": "Height of the Pokemon",
//                     },
//                     "weight": {
//                         "type": "number",
//                         "description": "Weight of the Pokemon",
//                     },
//                     "basexp": {
//                         "type": "number",
//                         "description": "Base experience points",
//                     },
//                     "hp": {
//                         "type": "number",
//                         "description": "Hit points",
//                     },
//                     "attack": {
//                         "type": "number",
//                         "description": "Attack points",
//                     },
//                     "defense": {
//                         "type": "number",
//                         "description": "Defense points",
//                     },
//                     "sattack": {
//                         "type": "number",
//                         "description": "Special attack points",
//                     },
//                     "sdefense": {
//                         "type": "number",
//                         "description": "Special defense points",
//                     },
//                     "moves": {
//                         "type": "array",
//                         "items": {"type": "string"},
//                         "description": "List of moves, such as Pound, Karate Chop, or Double Slap, come up with more.",
//                     },
//                     "abilities": {
//                         "type": "array",
//                         "items": {"type": "string"},
//                         "description": "List of abilities",
//                     },
//                 },
//                 "required": ["name", "desc", "sprite", "height", "weight", "basexp", "hp", "attack", "defense", "sattack", "sdefense", "moves", "abilities"],
//             },
//         },
//     }
// ]


// fcresponse = client.chat.completions.create(
//     model="gpt-4",
//     messages=user_messages,
//     tools=tools,
//     tool_choice="auto",
// )

// fcresponse_message = fcresponse.choices[0].message
// fctool_calls = fcresponse_message.tool_calls
// # print(fctool_calls[0])

// from airtable import airtable
// from google.colab import userdata

// at_api_key = userdata.get('AIRTABLE_API_KEY')
// base_id = 'app1GiTMoy1e5Bl0e'
// table_name = 'imaginary_pokemon'

// at = airtable.Airtable(base_id, at_api_key)

// def add_record(name, desc, height, weight, basexp, hp, attack, defense, sattack, sdefense, moves, abilities, imageUrl):
//   record = {
//         'Name': name,
//         'Description': desc,
//         'Height': height,
//         'Weight': weight,
//         'Base Experience': basexp,
//         'HP': hp,
//         'SpriteImage': imageUrl,
//         'Attack': attack,
//         'Defense': defense,
//         'Special Attack': sattack,
//         'Special Defense': sdefense,
//         'Moves': moves,
//         'Abilities': abilities
//   }

//   at.create(table_name, record)

// import json
// import requests

// data = json.loads(fctool_calls[0].function.arguments)

// add_record(
//   name=data["name"],
//   desc=data["desc"],
//   height=data["height"],
//   weight=data["weight"],
//   basexp=data["basexp"],
//   hp=data["hp"],
//   attack=data["attack"],
//   defense=data["defense"],
//   sattack=data["sattack"],
//   sdefense=data["sdefense"],
//   moves=" ".join(data["moves"]),
//   abilities=" ".join(data["abilities"]),
//   imageUrl=[{ "url": imageresponse.data[0].url }]
// )




