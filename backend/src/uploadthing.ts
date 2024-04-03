import { createUploadthing, type FileRouter  } from "uploadthing/express";
import { UTApi } from 'uploadthing/server';
import dotenv from 'dotenv';

dotenv.config();
const f = createUploadthing();
 
export const uploadRouter = {
  imageUploader: f({
    image: {
      maxFileSize: "8MB",
      maxFileCount: 1,
    },
  }).onUploadComplete((data) => {
    console.log("upload completed", data);
  }),
} satisfies FileRouter;

export type OurFileRouter = typeof uploadRouter;
export const utapi = new UTApi({ 
  apiKey: process.env.UPLOADTHING_SECRET
});