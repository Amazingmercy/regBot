const RegStep = require("../models/regStepModel.js");
const data = require("../testData.json");

const insertData = async function() {
  try {
    await RegStep.insertMany(data);
    console.log('Documents inserted successfully');
  } catch (error) {
    console.error('Error inserting documents:', error);
  }
};

module.exports = {
  insertData
};
