import { KMSClient, SignCommand } from '@aws-sdk/client-kms'

// Initialize KMS client
const kmsClient = new KMSClient({ region: process.env.AWS_REGION })

// KMS key ARN
const keyArn = `arn:aws:kms:${process.env.AWS_REGION}:${process.env.AWS_ACCOUNT_ID}:key/${process.env.AWS_SIGNATURE_KEY_ID}`

export async function signWithKMS(payload: object) {
	const algorithm = 'RS256'
	const header = {
		alg: algorithm,
		typ: 'JWT',
	}

	// Create JWT header and payload
	const tokenHeader = Buffer.from(JSON.stringify(header)).toString('base64url')
	const tokenPayload = Buffer.from(JSON.stringify(payload)).toString('base64url')
	const unsignedToken = `${tokenHeader}.${tokenPayload}`

	// Sign with KMS
	const signCommand = new SignCommand({
		KeyId: keyArn,
		Message: Buffer.from(unsignedToken),
		MessageType: 'RAW',
		SigningAlgorithm: 'RSASSA_PKCS1_V1_5_SHA_256',
	})

	console.log({ signCommand })
	const response = await kmsClient.send(signCommand)
	console.log({ response })

	if (!response.Signature) {
		throw new Error('Failed to sign the message with KMS.')
	}

	// Generate JWT
	const signature = Buffer.from(response.Signature).toString('base64url')
	return `${unsignedToken}.${signature}`
}
