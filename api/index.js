const axios = require('axios');

// for mutation
const memoryData = {};

exports.query = async ({ key, url }) => {
  if (memoryData[key] === undefined) {
    const { data } = await axios.get(url);
    memoryData[key] = data;
  }

  return memoryData[key];
};
