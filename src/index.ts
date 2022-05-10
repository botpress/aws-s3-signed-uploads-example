import { S3Client } from "@aws-sdk/client-s3";
import { completeMultiUpload, initiateMultipartUpload } from "./multipart";
import { generatePresignedUrlsParts } from "./presigned";
import * as fs from "fs";
import { FILE_CHUNK_SIZE } from "./constants";
import { uploadParts } from "./upload";

const BUCKET_NAME = process.env.BUCKET_NAME;
const KEY = process.env.KEY;

const s3 = new S3Client({});

async function main() {
  if (!BUCKET_NAME) {
    throw new Error("BUCKET_NAME undefined");
  }

  if (!KEY) {
    throw new Error("KEY undefined");
  }

  const fileBuf = fs.readFileSync("/Users/spg/Downloads/PokerStars.app.zip");
  const partsCount = Math.ceil(fileBuf.length / FILE_CHUNK_SIZE);
  const uploadId = await initiateMultipartUpload(s3, BUCKET_NAME, KEY);
  const presignedUrls = await generatePresignedUrlsParts(
    s3,
    uploadId,
    partsCount,
    BUCKET_NAME,
    KEY
  );
  const parts = await uploadParts(fileBuf, presignedUrls);
  await completeMultiUpload(s3, BUCKET_NAME, KEY, uploadId, parts);
}

main();
