import { DynamoDBClient, UpdateItemCommand } from "@aws-sdk/client-dynamodb";
import {
  DynamoDBDocumentClient,
  ScanCommand,
  PutCommand,
  GetCommand,
  DeleteCommand,
} from "@aws-sdk/lib-dynamodb";
import { randomUUID } from "crypto";

const client = new DynamoDBClient({});

const dynamo = DynamoDBDocumentClient.from(client);

const tableName = "users";

export const handler = async (event, context) => {
  let body;
  let statusCode = 200;
  const headers = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "*",
  };

  try {
    switch (event.routeKey) {
      case "GET /users":
        let filterExpression = "";
        let expressionAttributeValues = {};
        let expressionAttributeNames = {};
        let limit = 5;

        if (event.queryStringParameters && event.queryStringParameters.name) {
          const name = event.queryStringParameters.name;
          expressionAttributeNames = { "#n": "name" };
          expressionAttributeValues = { ":name": name };
          filterExpression = "contains(#n, :name)";
        }

        const exclusiveStartKey =
          event.queryStringParameters && event.queryStringParameters.page
            ? { id: event.queryStringParameters.page }
            : undefined;

        const params = {
          TableName: tableName,
          FilterExpression: filterExpression || undefined,
          ExpressionAttributeNames:
            Object.keys(expressionAttributeNames).length > 0
              ? expressionAttributeNames
              : undefined,
          ExpressionAttributeValues:
            Object.keys(expressionAttributeValues).length > 0
              ? expressionAttributeValues
              : undefined,
          ExclusiveStartKey: exclusiveStartKey,
          Limit: limit,
        };
        body = await dynamo.send(new ScanCommand(params));
        body = {
          data: body.Items,
          lastEvaluatedKey: body.LastEvaluatedKey || null,
        };
        break;
      case "GET /users/{id}":
        body = await dynamo.send(
          new GetCommand({
            TableName: tableName,
            Key: {
              id: event.pathParameters.id,
            },
          })
        );
        body = body.Item;
        break;
      case "POST /users":
        let requestJSON = JSON.parse(event.body);
        const newUser = {
          id: randomUUID(),
          text: requestJSON.text,
          name: requestJSON.name,
          description: requestJSON.description,
          phone: requestJSON.phone,
          image: "https://picsum.photos/200/300",
        };
        await dynamo.send(
          new PutCommand({
            TableName: tableName,
            Item: newUser,
          })
        );
        body = newUser;
        break;
      case "PUT /users/{id}":
        let requestJSONPut = JSON.parse(event.body);
        body = await dynamo.send(
          new UpdateItemCommand({
            TableName: tableName,
            Key: { id: { S: event.pathParameters.id } },
            ExpressionAttributeNames: {
              "#n": "name",
              "#t": "text",
              "#d": "description",
              "#p": "phone",
            },
            ExpressionAttributeValues: {
              ":name": { S: requestJSONPut.name },
              ":text": { S: requestJSONPut.text },
              ":description": { S: requestJSONPut.description },
              ":phone": { S: requestJSONPut.phone },
            },
            UpdateExpression:
              "set #n = :name, #t = :text, #d = :description, #p = :phone",
            ReturnValues: "UPDATED_NEW",
          })
        );
        break;
      case "DELETE /users/{id}":
        body = await dynamo.send(
          new DeleteCommand({
            TableName: tableName,
            Key: {
              id: event.pathParameters.id,
            },
          })
        );
        break;
      default:
        throw new Error({
          message: `Unsupported route: "${event.routeKey}"`,
          me: event,
        });
    }
  } catch (err) {
    console.log(err);
    statusCode = 400;
    body = err.message;
  } finally {
    body = JSON.stringify(body);
  }

  return {
    statusCode,
    body,
    headers,
  };
};
