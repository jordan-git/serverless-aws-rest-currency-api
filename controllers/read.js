'use strict';

const AWS = require('aws-sdk');
const dynamoDb = new AWS.DynamoDB.DocumentClient();

async function getCurrency(code = null) {
  try {
    const params = {
      TableName: "group-7-db"
    }

    // if code exists, search database for that code
    if (code) {
      params.Key = { code };
      const { Items } = await dynamoDb.get(params).promise();

      return Items;
    }

    // get all items in the database
    const { Items } = await dynamoDb.scan(params).promise();

    return Items;
  } catch (err) {
    console.error(err);
  }
}

exports.handler = async (event, context, callback) => {
  try {
    const currencyResults = event.pathParameters?.code ? await getCurrency(event.pathParameters.code) : await getCurrency();

    callback(null, {
      statusCode: 200,
      body: JSON.stringify(currencyResults)
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