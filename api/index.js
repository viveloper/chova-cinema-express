const axios = require('axios');

// for mutation
const memoryData = {};

exports.query = async ({ key, url }) => {
  const { data } = await axios.get(url);
  if (memoryData[key] === undefined) {
    memoryData[key] = data;
  }
  return memoryData[key];
};
