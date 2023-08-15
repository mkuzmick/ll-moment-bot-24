const { findRecordByValue, findRecordById, addRecord } = require('../../ll-modules/airtable-tools')
const { magenta, gray, darkgray, yellow, blue, divider, red } = require('../../ll-modules/utilities/ll-loggers')

module.exports = async ({ ack, body, view, client, logger }) => {
    // Acknowledge the view_submission request
    ack();
    red(divider, divider, "task_submission", divider, divider)
    blue(divider, "view", view)
    darkgray(divider, "body", body)
    const title = view['state']['values']['task_title']['plain_text_input-task']['value'] || "No Title";
    const availableForSlackChannels = view['state']['values']['available_for']['AvailableFor']['selected_conversations'] || null;
    const availableForAirtableUsers = []
    for (let i = 0; i < availableForSlackChannels.length; i++) {
      const slackChannel = availableForSlackChannels[i];
      try {
        const workerPropsResult = await findRecordByValue({
          baseId: process.env.AIRTABLE_WORK_BASE,
          table: "WorkerProps",
          field: "SlackChannel",
          view: "MAIN",
          value: slackChannel
        })
        availableForAirtableUsers.push(workerPropsResult.id)
      } catch (error) {
        red(divider, `${slackChannel} is a channel not yet associated with WorkerProps`, divider)
      }
    }
    const assignedByAirtableUsers = []
    try {
      const assignedByResult = await findRecordByValue({
        baseId: process.env.AIRTABLE_WORK_BASE,
        table: "Workers",
        field: "SlackId",
        view: "MAIN",
        value: body.user.id
      })
      assignedByAirtableUsers.push(assignedByResult.id)
      blue(divider, "ASSIGNED BY RESULT", assignedByResult, divider)
    } catch (error) {
      red("user not found")
      return (error)
    }
    const notes = view['state']['values']['task_description']['plain_text_input-task']['value'];
    const temporalStatus = view['state']['values']['task_temporalStatus']['radio_buttons-task']['selected_option']['value'];
    const taskRecord = {
      Title: title,
      AssignedTo: [process.env.TASK_DELEGATION_AIRTABLE_ID],
      TemporalStatus: temporalStatus,
      Notes: notes,
      Type: ["To Delegate"]
    }
    if (assignedByAirtableUsers) {
      taskRecord.AssignedBy = assignedByAirtableUsers
    }
    if (availableForAirtableUsers) {
      taskRecord.AvailableFor = availableForAirtableUsers
    }
    magenta(taskRecord)
    try {
      const airtableResult = await addRecord({
        baseId: process.env.AIRTABLE_WORK_BASE,
              table: "Tasks",
              record: taskRecord
      })
      magenta(`saved to airtable`, airtableResult)
    } catch (error) {
      
    }
}
