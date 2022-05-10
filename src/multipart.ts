import {
  S3Client,
  CreateMultipartUploadCommand,
  CompleteMultipartUploadCommand,
  Part,
} from "@aws-sdk/client-s3";

export async function initiateMultipartUpload(
  s3: S3Client,
  bucket: string,
  key: string,
  contentType: string
) {
  const res = await s3.send(
    new CreateMultipartUploadCommand({
      Bucket: bucket,
      Key: key,
      ContentType: contentType,
    })
  );

  if (!res.UploadId) {
    throw new Error("UploadId undefined");
  }

  return res.UploadId;
}

export async function completeMultiUpload(
  s3: S3Client,
  bucket: string,
  key: string,
  uploadId: string,
  parts: Part[]
) {
  await s3.send(
    new CompleteMultipartUploadCommand({
      Bucket: bucket,
      Key: key,
      UploadId: uploadId,
      MultipartUpload: { Parts: parts },
    })
  );
}
