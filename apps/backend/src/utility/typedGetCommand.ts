import { DynamoDBDocumentClient, GetCommand, GetCommandInput } from '@aws-sdk/lib-dynamodb'

export async function typedGetCommand<T>(docClient: DynamoDBDocumentClient, params: GetCommandInput): Promise<T | undefined> {
	const command = new GetCommand(params)
	const { Item } = await docClient.send(command)

	return Item as T | undefined
}
