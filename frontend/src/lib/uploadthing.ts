import {
    generateUploadButton,
    generateUploadDropzone,
  } from "@uploadthing/react";

  export const UploadButton = generateUploadButton({
     url: 'http://localhost:3000/api/uploadthing',
  });
  export const UploadDropzone = generateUploadDropzone();