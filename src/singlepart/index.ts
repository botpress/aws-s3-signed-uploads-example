import { S3Client } from "@aws-sdk/client-s3";
import { generatePresignedUrl } from "./presigned";
import * as fs from "fs";
import * as path from "path";
import { uploadFile } from "./upload";
import * as mime from "mime-types";

const BUCKET_NAME = process.env.BUCKET_NAME;

const s3 = new S3Client({});

async function main() {
  if (!BUCKET_NAME) {
    throw new Error("BUCKET_NAME undefined");
  }

  const filepath = process.argv[2];

  // Step 1: (client-side) determine content type
  const fileBuf = fs.readFileSync(filepath);
  const key = path.basename(filepath);
  const contentType = mime.lookup(key) || "binary/octet-stream";

  // Step 2: (server-side) Generate presigned URL
  const presignedUrl = await generatePresignedUrl(
    s3,
    BUCKET_NAME,
    key,
    contentType
  );

  // Step 3: (client-side) Upload file
  await uploadFile(fileBuf, presignedUrl);
}

main();
