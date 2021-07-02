'use strict';

const AWS = require('aws-sdk'); // eslint-disable-line import/no-extraneous-dependencies

const dynamoDb = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event, context, callback) => {
  try {
    const params = {
      TableName: "group-7-db",
      Key: {
        code: event.pathParameters.code,
      },
    };

    const result = await dynamoDb.delete(params).promise();

    callback(null, {
      statusCode: 204
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