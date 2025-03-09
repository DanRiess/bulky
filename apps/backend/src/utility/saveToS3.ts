import { PutObjectCommand, PutObjectCommandInput, S3Client } from '@aws-sdk/client-s3'

export async function saveToS3(fileName: string, body: PutObjectCommandInput['Body']) {
	console.log('saving to s3')
	console.log({ fileName, body })
	console.log({ bucket: process.env.NINJA_PROXY_BUCKET })
	const s3 = new S3Client()

	const params: PutObjectCommandInput = {
		Bucket: process.env.NINJA_PROXY_BUCKET,
		Key: fileName,
		Body: body,
		ContentEncoding: 'br',
		ContentType: 'application/octet-stream',
	}

	const response = await s3.send(new PutObjectCommand(params))
	console.log({ response })

	return response
}
