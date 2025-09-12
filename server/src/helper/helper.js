

const sendResponse = (res, responseData) => {
  return res.status(responseData.data.statusCode || 200).json(responseData);
};
module.exports = { sendResponse };
