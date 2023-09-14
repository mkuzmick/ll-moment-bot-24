const Airtable = require(`airtable`)
const { cyan, blue, yellow } = require(`./mk-utilities`)

module.exports.addRecord = async function(options){
  var base = new Airtable({apiKey: process.env.AIRTABLE_API_KEY}).base(options.baseId);
  var airtableResult = await base(options.table).create(options.record).then(result => {
    console.log("saved to airtable");
    return result;
  })
    .catch(err => {
      console.log("\nthere was an error with the AT push\n");
      console.error(err);
      return;
    });
  return airtableResult;
}

module.exports.findOneById = async function(options) {
  var result = await options.base(options.table)
    .find(options.recordId)
    .catch(err=>{console.error(err); return});
  return result;
}


/**
 * Finds a single record by its value in a specified table and view.
 * 
 * @param {string} baseId - The base from which to select the records.
 * @param {string} table - The table name where the record is located.
 * @param {string} value - The value to search for.
 * @param {string} field - The field/column name in which to search the value.
 * @param {string} [view="Grid view"] - The view from which to select the records. Defaults to "Grid view" if not provided.
 * 
 * @returns {Object|null} - The found record object or null if no record is found.
 */
module.exports.findOneByValue = async function({ baseId, table, value, field, view = "Grid view" }) {
  let theRecords = [];
  var base = new Airtable({apiKey: process.env.AIRTABLE_API_KEY}).base(baseId);
  try {
    await base(table).select(
      {
        maxRecords: 1,
        view,
        filterByFormula: `${field}='${value}'`
      }
    ).eachPage(function page(records, next) {
      theRecords.push(...records);
      next();
    });
  } catch (err) {
    console.error(err);
    return null;  // Explicitly returning null on error for clarity
  }
  
  return theRecords[0] || null;  // Return the first record or null if none were found
}



module.exports.findManyByValue = async function(options) {
  theRecords = [];
  var queryOptions = {
    maxRecords: options.maxRecords ? options.maxRecords : 10,
    view: options.view ? options.view : "Grid view",
    filterByFormula: `${options.field}=${options.value}`
  }
  console.log(queryOptions);
  await options.base(options.table).select(queryOptions).eachPage(function page(records, next){
    theRecords.push(...records);
    next()
  })
  // .then(()=>{
  //   // return(theRecords);
  // })
  .catch(err=>{console.error(err); return})
  return theRecords;
}

module.exports.findManyByMultiSelectValue = async function(options) {
  theRecords = [];
  var queryOptions = {
    maxRecords: options.maxRecords ? options.maxRecords : 10,
    view: options.view ? options.view : "Grid view",
    filterByFormula: `${options.field}=${options.value}`
  }
  console.log(queryOptions);
  await options.base(options.table).select(queryOptions).eachPage(function page(records, next){
    theRecords.push(...records);
    next()
  })
  // .then(()=>{
  //   // return(theRecords);
  // })
  .catch(err=>{console.error(err); return})
  return theRecords;
}


module.exports.findManyByFormula = async function(options) {
  theRecords = [];
  await options.base(options.table).select(
    {
      maxRecords: options.maxRecords,
      view: options.view ? options.view : "Grid view",
      filterByFormula: options.formula
    }
  ).eachPage(function page(records, next){
    theRecords.push(...records);
    next()
  })
  // .then(()=>{
  //   // return(theRecords);
  // })
  .catch(err=>{console.error(err); return})
  return theRecords;
}

module.exports.findMany = async function(options) {
  theRecords = [];
  await options.base(options.table).select(
    {
      maxRecords: options.maxRecords ? options.maxRecords : 10,
      view: options.view ? options.view : "Grid view",
    }
  ).eachPage(function page(records, next){
    theRecords.push(...records);
    next()
  })
  // .then(()=>{
  //   // return(theRecords);
  // })
  .catch(err=>{console.error(err); return})
  return theRecords;
}

module.exports.findManyByFormula = async function(options) {
  theRecords = [];
  await options.base(options.table).select(
    {
      maxRecords: options.maxRecords,
      view: options.view,
      filterByFormula: options.formula
    }
  ).eachPage(function page(records, next){
    theRecords.push(...records);
    next()
  })
  // .then(()=>{
  //   // return(theRecords);
  // })
  .catch(err=>{console.error(err); return})
  return theRecords;
}
