import { S3Client } from "@aws-sdk/client-s3";
import { completeMultiUpload, initiateMultipartUpload } from "./multipart";
import { generatePresignedUrlsParts } from "./presigned";
import * as fs from "fs";
import * as path from "path";
import { FILE_CHUNK_SIZE } from "./constants";
import { uploadParts } from "./upload";
import * as mime from "mime-types";

const BUCKET_NAME = process.env.BUCKET_NAME;

const s3 = new S3Client({});

async function main() {
  if (!BUCKET_NAME) {
    throw new Error("BUCKET_NAME undefined");
  }

  const filepath = process.argv[2];

  // Step 1: (client-side) determine chunk count, content type
  const fileBuf = fs.readFileSync(filepath);
  const basename = path.basename(filepath);
  const contentType = mime.lookup(basename) || "binary/octet-stream";
  const key = `somefolder/${basename}`;
  const partsCount = Math.ceil(fileBuf.length / FILE_CHUNK_SIZE);

  // Step 2: (server-side) Initiate multipart upload
  const uploadId = await initiateMultipartUpload(
    s3,
    BUCKET_NAME,
    key,
    contentType
  );

  // Step 3: (server-side) Generate presigned URLs
  const presignedUrls = await generatePresignedUrlsParts(
    s3,
    uploadId,
    partsCount,
    BUCKET_NAME,
    key
  );

  // Step 4: (client-side) Upload parts
  const parts = await uploadParts(fileBuf, presignedUrls);

  // Step 5: (server-side): Complete multipart upload
  await completeMultiUpload(s3, BUCKET_NAME, key, uploadId, parts);
}

main();
