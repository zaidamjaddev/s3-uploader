import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { NextResponse } from "next/server";

const client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.ACCESS_KEY,
    secretAccessKey: process.env.SECRET_KEY,
  },
});

export async function POST(req) {
  try {
    const formData = await req.formData();
    const file = formData.get("file");
    console.log(file);

    if (!file) {
      NextResponse.json({ error: "no file uploaded" }, { status: 400 });
    }
    const buffer = Buffer.from(await file.arrayBuffer());
    const fileName = `${Date.now()}-${file.name}`;

    const command = new PutObjectCommand({
      Bucket: process.env.S3_BUCKET,
      Key: `uploads/${fileName}`,
      Body: buffer,
      ContentType: file.type,
    });

    await client.send(command);

    //https://zaid-private-bucket.s3.us-east-1.amazonaws.com/uploads/1757423724419-image2.jpeg

    const imageUrl = `https://zaid-private-bucket.s3.us-east-1.amazonaws.com/uploads/${fileName}`

    return NextResponse.json({ url: imageUrl }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error });
  }
}
