# S3 Uploads with Signed URLs

## What is this?

This repo contains examples of uploading files to a S3 bucket using Signed URLs

## Getting started

1. Install: `yarn`
2. Deploy the CDK app contained in `src/cdk-example`. From the `src/cdk-example` directory, run `npx cdk deploy --all --profile {your AWS profile} --require-approval never --progress events` .

   - Note the stack's outputs (`AccessKeyOutput`, `BucketNameOutput`, `SecretAccessKeyOutput`), they'll be useful in the following steps
   - This stack contains a IAM User that can upload files to a S3 bucket

3. Test singlepart uploads: from the repo's root, run `AWS_REGION={region where you deployed the CDK app} AWS_ACCESS_KEY_ID={value of AccessKeyOutput} AWS_SECRET_ACCESS_KEY={value of SecretAccessKeyOutput} BUCKET_NAME={value of BucketNameOutput} npx ts-node src/singlepart/index.ts path/to/a/file/to/upload.jpg`
   - After the command completes, you'll find the uploaded file in the S3 bucket created in step 2
4. Test multipart uploads: from the repo's root, run `AWS_REGION={region where you deployed the CDK app} AWS_ACCESS_KEY_ID={value of AccessKeyOutput} AWS_SECRET_ACCESS_KEY={value of SecretAccessKeyOutput} BUCKET_NAME={value of BucketNameOutput} npx ts-node src/multipart/index.ts path/to/a/file/to/upload.jpg`
   - After the command completes, you'll find the uploaded file in the S3 bucket created in step 2

## About uploads in S3

To upload data in a S3 bucket, 2 methods exist:

1. Single PUT object request (I call this "singlepart upload")
2. Multipart upload

### Comparing singlepart and multipart uploads

#### Singlepart uploads

- Works with files <= 5GB in size
- Simpler to implement (only 1 request to S3)
- If the request is interrupted, it has to be started all over

#### Multipart uploads

- Works with files <= 5TB in size
- More complex to implement (multiple requests to S3)
- Improved throughput – You can upload parts in parallel to improve throughput
- Quick recovery from any network issues – Smaller part size minimizes the impact of restarting a failed upload due to a network error.
- Pause and resume object uploads – You can upload object parts over time. After you initiate a multipart upload, there is no expiry; you must explicitly complete or stop the multipart upload.
- Begin an upload before you know the final object size – You can upload an object as you are creating it.
