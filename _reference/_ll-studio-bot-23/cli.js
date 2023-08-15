#!/usr/bin/env node

var figlet = require('figlet');
var clear = require('clear');
const { makeShootProxy, makeMonthOfProxy } = require(`./src/ll-bots/proxy-bot/make-proxy`);
const hackmdtest = require('./src/ll-modules/ll-hackmd-tools/hackmd-test')
const watch = require(`./src/ll-bots/button-bot/watcher`)
const { rename, makeFolders, ingest, eventsToFolders, calendlyCsvToFolders, llprobe } = require('./src/ll-modules/ll-ingest-tools')
const getSlackData = require('./src/ll-modules/ll-slack-tools/utils/get-slack-data')
// const videoToStills = require(`./src/tools/image-bot/video-to-stills`)
const { hyperFormat } = require(`./src/ll-modules/ll-blackmagic-tools/hyperdeck-bot`)

require("dotenv").config({ path: __dirname + `/.env.cli` });

// store any arguments passed in using yargs
var yargs = require('yargs').argv;

console.log("launching it.")

// options: rename, makefolders, proxy, proxyf2, 

if (yargs.mk) {
    mk(yargs)
} else if (yargs.rename) {
    rename(yargs.rename)
} else if (yargs.makefolders) {
    makeFolders(yargs.makefolders)
} else if (yargs.proxy) {
    const proxyOptions = {}
    makeShootProxy(yargs.proxy, proxyOptions)
} else if (yargs.proxyf2) {
    const proxyOptions = {}
    makeMonthOfProxy(yargs.proxyf2, proxyOptions)
} else if (yargs.peakgif) {
    makePeakGif(yargs.peakgif)
} else if (yargs.bwFolder) {
    watch(yargs.bwFolder)
} else if (yargs.v2s) {
    videoToStills(yargs.v2s)
} else if (yargs.hyperformat) {
    hyperFormat()
} else if (yargs.ingest) {
    ingest(yargs)
} else if (yargs.llprobe) {
    llprobe(yargs.llprobe)
} else if (yargs.events2folders) {
    eventsToFolders(yargs)
} else if (yargs.calendly2folders) {
    calendlyCsvToFolders(yargs)
} else if (yargs.getSlackData) {
    getSlackData(yargs)
} else if (yargs.hackmd) {
    console.log(process.env.HACKMD_API_KEY)
    hackmdtest({token: process.env.HACKMD_API_KEY})
} else {
    console.log(`sorry, you didn't enter a recognized command.`)
}