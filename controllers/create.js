'use strict';

const AWS = require('aws-sdk');
const dynamoDb = new AWS.DynamoDB.DocumentClient();

async function createCurrency(data) {
  try {
    const params = {
      TableName: "group-7-db",
      Item: data
    }

    await dynamoDb.put(params).promise();
  } catch (err) {
    return err;
  }
}

function isValidData(data) {
  if (Object.keys(data).length !== 3)
    return false;

  for (const property of ['name', 'code', 'rates']) {
    if (!data.hasOwnProperty(property)) {
      return false;
    }
  }

  if (!Array.isArray(data.rates)) {
    return false;
  }

  return true;
}

exports.handler = async (event, context, callback) => {
  try {
    const parsedJson = JSON.parse(event.body);

    if (!isValidData(parsedJson)) {
      callback(null, {
        statusCode: 422,
        body: JSON.stringify({
          error: "Invalid data format"
        })
      });
    }

    if (Array.isArray(parsedJson)) {
      for (const curr of parsedJson) {
        await createCurrency(curr);
      }
    } else {
      await createCurrency(parsedJson);
    }

    callback(null, {
      statusCode: 201,
      body: event.body
    });
  } catch (err) {
    console.error(error);
    callback(null, {
      statusCode: 501,
      body: JSON.stringify({
        error: "Internal server error"
      })
    });
  }
}