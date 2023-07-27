const { S3Client } = require('@aws-sdk/client-s3')

const Region = 'sa-east-1'
const Credentials = {
    accessKeyId: "AKIAZXDLZRMQJKCMOB7A",
    secretAccessKey: "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",
}
const s3Client= new S3Client({region: Region, credentials: Credentials})


module.exports = s3Client