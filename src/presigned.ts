import { S3Client, UploadPartCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

export async function generatePresignedUrlsParts(
  s3: S3Client,
  uploadId: string,
  parts: number,
  bucket: string,
  key: string
) {
  const baseParams = {
    Bucket: bucket,
    Key: key,
    UploadId: uploadId,
  };

  const promises = [];

  for (let index = 0; index < parts; index++) {
    promises.push(
      getSignedUrl(
        s3,
        new UploadPartCommand({
          ...baseParams,
          PartNumber: index + 1,
        }),
        { expiresIn: 3600 }
      )
    );
  }

  const res = await Promise.all(promises);

  return res.reduce((map, url, index) => {
    map[index] = url;
    return map;
  }, {} as Record<number, string>);
}
