import { KMSClient, SignCommand, VerifyCommand } from '@aws-sdk/client-kms'

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

	const response = await kmsClient.send(signCommand)

	if (!response.Signature) {
		throw new Error('Failed to sign the message with KMS.')
	}

	// Generate JWT
	const signature = Buffer.from(response.Signature).toString('base64url')
	return `${unsignedToken}.${signature}`
}

export async function verifyWithKms(jwt: string) {
	// Get the jwt components
	const [headerB64, payloadB64, signatureB64] = jwt.split('.')
	if (!headerB64 || !payloadB64 || !signatureB64) {
		throw new Error('Invalid JWT structure.')
	}

	// Create buffers from the unsigned message and the signature
	const message = Buffer.from(`${headerB64}.${payloadB64}`)
	const signature = Buffer.from(signatureB64, 'base64')

	const verifyCommand = new VerifyCommand({
		KeyId: keyArn,
		Message: message,
		MessageType: 'RAW',
		Signature: signature,
		SigningAlgorithm: 'RSASSA_PKCS1_V1_5_SHA_256',
	})

	const response = await kmsClient.send(verifyCommand)

	return response.SignatureValid || false
}
