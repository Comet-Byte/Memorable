import { S3Client } from "@aws-sdk/client-s3";
import { env } from "@invoicely/utilities";
import { middleware } from "@/trpc/init";

export const awsS3Middleware = middleware(async function awsS3Middleware(options) {
  const s3 = new S3Client({
    region: env.SUPABASE_S3_REGION,
    endpoint: env.SUPABASE_S3_ENDPOINT,
    // Supabase Storage requires path-style addressing (endpoint/bucket/key),
    // not virtual-hosted style (bucket.endpoint/key).
    forcePathStyle: true,
    credentials: {
      accessKeyId: env.SUPABASE_S3_ACCESS_KEY_ID,
      secretAccessKey: env.SUPABASE_S3_SECRET_ACCESS_KEY,
    },
  });

  return options.next({
    ctx: {
      s3: s3,
      // getPresignedUrl: getSignedUrl,   <---- Dont ever use this shit again
    },
  });
});
