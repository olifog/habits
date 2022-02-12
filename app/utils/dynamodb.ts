import { DynamoDBClient, BatchExecuteStatementCommand } from "@aws-sdk/client-dynamodb";

const client = new DynamoDBClient({
  region: 'eu-west-2',
  credentials: {
    secretAccessKey: process.env.DYNAMODB_SECRET_ACCESS_KEY,
    accessKeyId: process.env.DYNAMODB_ACCESS_KEY_ID
  }
})

export default client
