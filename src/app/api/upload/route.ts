import { v2 as cloudinary } from "cloudinary";
import { NextResponse } from "next/server";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const audio = formData.get("audio") as File;
    
    if (!audio) {
      return NextResponse.json(
        { error: "No audio file provided" },
        { status: 400 }
      );
    }

    const arrayBuffer = await audio.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    
    const base64Audio = buffer.toString("base64");
    const dataURI = `data:${audio.type};base64,${base64Audio}`;

    const result = await cloudinary.uploader.upload(dataURI, {
      resource_type: "video",
      folder: process.env.CLOUDINARY_FOLDER,
    });

    return NextResponse.json({ fileUrl: result.secure_url });
  } catch (error) {
    console.error("Error uploading to Cloudinary:", error);
    return NextResponse.json(
      { error: "Error uploading audio" },
      { status: 500 }
    );
  }
} 