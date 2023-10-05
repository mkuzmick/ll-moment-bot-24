const { Configuration, OpenAIApi } = require("openai");


module.exports.getListOfEngines = async function (options) {
    const configuration = new Configuration({
        organization: "org-vvnfQBL4vlR6Sl0qTlqz16Oh",
        apiKey: process.env.OPENAI_API_KEY,
    });
    const openai = new OpenAIApi(configuration);
    const response = await openai.listEngines();
}