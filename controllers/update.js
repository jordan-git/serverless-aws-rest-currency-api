'use strict';

const AWS = require('aws-sdk');
const { parse } = require('uuid');

const dynamoDb = new AWS.DynamoDB.DocumentClient();

function isValidData(data) {
  try {
    if (Object.keys(data).length !== 2)
      return false;

    for (const property of ['name', 'rates']) {
      if (!data.hasOwnProperty(property)) {
        return false;
      }
    }

    return true;
  } catch (err) {
    return false;
  }
}

exports.handler = async (event, context, callback) => {
  try {
    const parsedJson = JSON.parse(event.body),
      { name, rates } = parsedJson;

    if (!isValidData(parsedJson)) {
      callback(null, {
        statusCode: 422,
        body: JSON.stringify({
          error: "Invalid data format"
        })
      });
    }

    const params = {
      TableName: "group-7-db",
      Key: {
        code: event.pathParameters.code,
      },
      ExpressionAttributeNames: {
        '#name_text': 'name'
      },
      ExpressionAttributeValues: {
        ':name': name,
        ':rates': rates,
      },
      UpdateExpression: 'SET #name_text = :name, rates = :rates',
      ReturnValues: 'ALL_NEW',
    };

    const { Attributes } = await dynamoDb.update(params).promise();

    callback(null, {
      statusCode: 200,
      body: JSON.stringify(Attributes)
    });
  } catch (err) {
    console.error(err);
    callback(null, {
      statusCode: 501,
      body: JSON.stringify({
        error: "Internal server error"
      })
    });
  }
}

//   exports.handler = (event, context, callback) => {
//     const timestamp = new Date().getTime();
//     const { ticker, price } = JSON.parse(event.body);



//     const params = {
//       TableName: "group-7-db",
//       Key: {
//         ticker: event.pathParameters.id,
//       },
//       ExpressionAttributeNames: {
//         '#todo_text': 'price',
//       },
//       ExpressionAttributeValues: {
//         ':ticker': ticker,
//         ':price': price,
//       },
//       UpdateExpression: 'SET #todo_text = :text, checked = :checked, updatedAt = :updatedAt',
//       ReturnValues: 'ALL_NEW',
//     };

//     // update the todo in the database
//     dynamoDb.update(params, (error, result) => {
//       // handle potential errors
//       if (error) {
//         console.error(error);
//         callback(null, {
//           statusCode: error.statusCode || 501,
//           headers: { 'Content-Type': 'text/plain' },
//           body: 'Couldn\'t fetch the todo item.',
//         });
//         return;
//       }

//       // create a response
//       const response = {
//         statusCode: 200,
//         body: JSON.stringify(result.Attributes),
//       };

//       callback(null, response);
//     });
//   }
// }