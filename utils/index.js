exports.getRandomInt = (min, max) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min; //최댓값은 제외, 최솟값은 포함
};

exports.getS3FullPath = (url) => {
  return url && !url.startsWith('http') ? process.env.S3_BASE_URL + url : url;
};
