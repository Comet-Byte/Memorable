import { DeleteObjectCommand, type S3Client } from "@aws-sdk/client-s3";
import { env } from "@invoicely/utilities";

export const deleteImage = async (s3: S3Client, key: string) => {
  const deleteImageResult = await s3.send(
    new DeleteObjectCommand({
      Bucket: env.SUPABASE_S3_BUCKET_NAME,
      Key: key,
    }),
  );

  // Supabase Storage / S3 DeleteObject returns 204 on success; some S3-compatible
  // implementations return 200 — accept both.
  const status = deleteImageResult.$metadata.httpStatusCode;
  if (status === 204 || status === 200) {
    return true;
  }

  return false;
};
