let desiredConfig = "MK_CONFIG"

const getConfig = async () => {
    let launchDate = new Date();
    let configTable = base.getTable("Config");
    let configRecords = await configTable.selectRecordsAsync();
    let configRecord = configRecords.records.find(record => record.getCellValue("Name") === desiredConfig);
    let config = JSON.parse(configRecord.getCellValueAsString("JSONValue"))
    config.launchTs = launchDate.getTime();
    return config
}

let CONFIG = await getConfig()
// output.inspect(CONFIG)

async function recordIdToObject(myTable, recordId) {
    // Fetch the record using the provided recordId
    const record = await myTable.selectRecordsAsync({ recordIds: [recordId] });
    // If the record doesn't exist, return null or handle as needed
    if (!record.records.length) {
        return null;
    }
    const singleRecord = record.records[0];
    const fields = myTable.fields;
    const recordObject = {};

    // Iterate over all fields and get their values
    for (const field of fields) {
        const fieldName = field.name;
        recordObject[fieldName] = singleRecord.getCellValue(fieldName);
    }
    recordObject.airtableRecordId = record.id;
    recordObject.airtableRecordName = record.name;
    return recordObject;
}

// rewrite to add all links to all task docs
const createProjectBook = async ({project, HACKMD_API_KEY, HACKMD_TEAM}) => {
    output.inspect(project)
    let payload = {
        title: `new project plan book for ${project.ProjectPlan[0].name || "no title"}`,
        content: `
${project.ProjectPlan[0].name} Book
===

main docs
---

- [ll-event-lab-today](/QMgM6lVvS6O55J8zdkQLCA)

reference
---

- [ll-event-lab-rationale-v1](/AunryFEcRm6SG8qAbHAyIw)
`, 
        readPermission: "owner",
        writePermission: "owner"
    }

    output.inspect(payload)
    
    let response = await remoteFetchAsync(`https://api.hackmd.io/v1/teams/${HACKMD_TEAM}/notes`, {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${HACKMD_API_KEY}`,
            "Content-Type": "application/json" 
        },
        body: JSON.stringify(payload) 
    });
    if (response.ok) {
        let data = await response.json();
        output.inspect(data);
        return data
    } else {
        return "error creating HackMd"
    }
}

// take data from project record object and create project plan
async function createProjectPlan (project) {
    let table = base.getTable("ProjectPlans");
    let record = await table.createRecordAsync({
        "ProjectPlanName": project.Id,
        // "_PROJECTS": [{id: project.airtableRecordId}]
    })
    return recordIdToObject(table, record)
}

const generateDocAndTask = async ({projectForDocsAndTasks, typeId}) => {
    let result = {createdTime: (new Date()).getTime()};
    let templateTable = base.getTable("DocTemplates");
    let workingDocsTable = base.getTable('WorkingDocs');
    let tasksTable = base.getTable('Tasks');

    // create task first

    // create doc
    let docTemplate = await templateTable.selectRecordAsync(typeId);
    output.inspect(docTemplate)
    let docTemplateObject = await recordIdToObject(templateTable, docTemplate.id);
    output.inspect(docTemplateObject);
    output.text(`going to create ${docTemplate.getCellValue("TaskTypeName")}`)
    output.inspect(projectForDocsAndTasks)
    output.text(JSON.stringify(projectForDocsAndTasks, null, 4))
    let payload = {
        title: `new ${docTemplate.getCellValue("TaskTypeName")} for ${projectForDocsAndTasks.projectPlan.ProjectPlanName || "no title"}`,
        content: `
---
tags: ${docTemplate.getCellValue("TaskTypeName")}, document
---
# new ${docTemplate.getCellValue("TaskTypeName")} for ${projectForDocsAndTasks.projectPlan.ProjectPlanName || "no title"}

${docTemplate.getCellValue("TemplateMarkdown") || ""}
`, 
        readPermission: "owner",
        writePermission: "owner"
    }

    output.inspect(payload)
    
    let response = await remoteFetchAsync(`https://api.hackmd.io/v1/teams/${CONFIG.HACKMD_TEAM}/notes`, {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${CONFIG.HACKMD_API_KEY}`,
            "Content-Type": "application/json" 
        },
        body: JSON.stringify(payload) 
    });
    if (response.ok) {
        let data = await response.json();
        output.inspect(data);
        result.workingDoc = data
    } else {
        return "error creating HackMd"
    }
    

    return result
}

const generateWorkingDocs = async (project) => {
    let templateTable = base.getTable("DocTemplates");
    let optionsView = templateTable.getView("CREATE_PROJECT_PLAN_OPTIONS")
    let templates = await optionsView.selectRecordsAsync();
    let buttons = templates.records.map(template => {return ({label: template.getCellValueAsString('TaskTitle'), value: template.id})})
    buttons.push({label: "I'm Done!", value: "done"})
    let templateChoice = await input.buttonsAsync('', buttons);
    output.inspect(templateChoice)
    if (templateChoice=="done") {
        return project
    } else {
        let taskResult = await generateDocAndTask({
            projectForDocsAndTasks: project, typeId: templateChoice
        })
        project.tasks.push(taskResult)
        return generateWorkingDocs(project)
    }

    // let theTemplate = await templateTable.selectRecordAsync(templateChoice)
    // output.inspect(theTemplate)
    // markdown+="---"
    // return markdown
    return templateChoice
}

// If this script is run from a button field, this will use the button's record instead.
let table = base.getTable('_PROJECTS');
let record = await input.recordAsync('Select a record to use', table);



let project = await recordIdToObject(table, record.id)
project.tasks = []
project.workingDocs = []
let projectPlan = await createProjectPlan(project)
project.projectPlan = projectPlan
output.inspect(project)


output.markdown(`# start\nBefore we can create the template, we need to know the type. Please select from the list below and we'll create the appropriate documents for you.`)

// maybe don't mutate the project in the function?
let projectWithPlanAndDocs = await generateWorkingDocs(project);
output.inspect(projectWithPlanAndDocs)

let projectBookId = await createProjectBook({project: projectWithPlanAndDocs, HACKMD_API_KEY: CONFIG.HACKMD_API_KEY, HACKMD_TEAM: CONFIG.HACKMD_TEAM });
// let hackMdResult = await createProjectBook({
//     HACKMD_TEAM: CONFIG.HACKMD_TEAM,
//     HACKMD_API_KEY: CONFIG.HACKMD_API_KEY,
//     project: project
// })

// output.inspect(hackMdResult)

