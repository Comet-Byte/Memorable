import path from "node:path";
import nextEnv from "@next/env";
const { loadEnvConfig } = nextEnv;
loadEnvConfig(path.resolve(process.cwd(), "../.."), true);

const { S3Client, ListObjectsV2Command, DeleteObjectCommand } = await import("@aws-sdk/client-s3");
const s3 = new S3Client({
  region: process.env.SUPABASE_S3_REGION,
  endpoint: process.env.SUPABASE_S3_ENDPOINT,
  forcePathStyle: true,
  credentials: {
    accessKeyId: process.env.SUPABASE_S3_ACCESS_KEY_ID,
    secretAccessKey: process.env.SUPABASE_S3_SECRET_ACCESS_KEY,
  },
});
const Bucket = process.env.SUPABASE_S3_BUCKET_NAME;

// Delete only MY test object (the a46f7117 one)
const myTestKey = "35f8a977-fd7b-4664-8060-bf71556e671f/logo-a46f7117-744a-4172-a9c7-b27af4cd9103";
await s3.send(new DeleteObjectCommand({ Bucket, Key: myTestKey }));
console.log("Deleted my test object:", myTestKey);

const list = await s3.send(new ListObjectsV2Command({ Bucket }));
console.log("\nRemaining objects in bucket (these are YOUR real uploads):");
(list.Contents ?? []).forEach((o) => console.log("  -", o.Key, `(${o.Size} bytes)`));
