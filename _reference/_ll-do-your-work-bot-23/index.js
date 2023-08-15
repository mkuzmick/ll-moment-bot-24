const appHome = require('./handlers/handle-app-home.js')
// const projectProposal = require('./project-proposal')
// const projectHackMd = require('./project-hackmd')
const newTaskView = require('./views/new-task-view.js')
const handleTaskViewSubmission = require('./handlers/handle-task-view-submission.js')
const handleMessage = require('./handlers/handle-message.js')
const newLaunchView = require('./views/new-launch-view.js')
const handleLaunchViewSubmission = require('./handlers/handle-launch-view-submission.js')
const newDelegateView = require('./views/new-delegate-view.js')
const handleDelegateViewSubmission = require('./handlers/handle-delegate-view-submission.js')


module.exports.appHome = appHome
module.exports.handleMessage = handleMessage
// module.exports.projectProposal = projectProposal
// module.exports.projectHackMd = projectHackMd
module.exports.newTaskView = newTaskView
module.exports.handleTaskViewSubmission = handleTaskViewSubmission
module.exports.newLaunchView = newLaunchView
module.exports.handleLaunchViewSubmission = handleLaunchViewSubmission
module.exports.newDelegateView = newDelegateView
module.exports.handleDelegateViewSubmission = handleDelegateViewSubmission

