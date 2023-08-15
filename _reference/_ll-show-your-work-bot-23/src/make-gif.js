var cp = require('child_process');
const { gray, magenta } = require('./utilities/mk-utilities');
var fs = require('fs');
var path = require('path');
const axios = require('axios')

const downloadFromSlack = async (url, downloadPath, options) => {
  const writer = fs.createWriteStream(downloadPath)
  const response = await axios({
      url: url,
      method: 'GET',
      headers: { Authorization: `Bearer ${process.env.SLACK_BOT_TOKEN}` },
      responseType: 'stream'
  })
  response.data.pipe(writer)
  return new Promise((resolve, reject) => {
  writer.on('finish', resolve)
  writer.on('error', reject)
  })
}

const makeGif = async (file) => {
  const gifPath = path.join(process.env.TEMP_STORAGE_ROOT, "gif", `${path.basename(file, path.extname(file))}_200.gif`)
  const palettePath = path.join(process.env.TEMP_STORAGE_ROOT, "gif", `${path.basename(file, path.extname(file))}_palette.png`)
  const width = 355
  const height = 200
  await cp.spawnSync('ffmpeg', ['-i', file, '-vf',
    'palettegen', palettePath]);
  await cp.spawnSync('ffmpeg', ['-i', file, '-i',
    palettePath, '-vf', ('scale=' + width + ":"
    + height), '-y', gifPath]);
  await fs.unlinkSync(palettePath)
  return ({
    gifPath: gifPath,
    videoPath: file
  })
}

// const determineDimensions = async (file) => {
//     const fileData = await llProbe(file)
// }

module.exports = async function(settings){
  magenta(`launching make-gif for ${settings.file.filename}`)
  const downloadPath = path.join(process.env.TEMP_STORAGE_ROOT, 'gif', path.basename(settings.file.url_private))
  const downloadResult = await downloadFromSlack(settings.file.url_private, downloadPath)  
  const gifResult = await makeGif(downloadPath)
  const slackResult = await settings.client.files.upload({
    file: fs.createReadStream(gifResult.gifPath),
    initial_comment: `gif from ${settings.file.name}`,
    filename: path.basename(gifResult.gifPath),
    title: `title for ${path.basename(gifResult.gifPath)}`,
    channels: process.env.SLACK_SHOW_YOUR_IMAGES_CHANNEL
  })
  return ({downloadPath: downloadPath, gifResult: gifResult})
};
