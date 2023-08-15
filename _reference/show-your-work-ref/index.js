const { findRecordByValue, findRecordById } = require('../ll-modules/utilities/airtable-tools')
const { magenta, gray, yellow, blue, divider } = require('../ll-modules/utilities/mk-loggers')

const appHome = require('./app-home')
const projectProposal = require('./project-proposal')
const projectHackMd = require('./project-hackmd')
const newActionView = require('./new-action-view')
const handleActionViewSubmission = require('./handle-action-view-submission')
const newLaunchView = require('./new-launch-view')

module.exports.appHome = appHome
module.exports.projectProposal = projectProposal
module.exports.projectHackMd = projectHackMd
module.exports.newActionView = newActionView
module.exports.newLaunchView = newLaunchView
module.exports.handleActionViewSubmission = handleActionViewSubmission
