import express from 'express';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import cors, { CorsOptions } from 'cors';
import cookieParser from 'cookie-parser'
import { PrismaClient } from '@prisma/client';
import multer from 'multer';
import { imageDataType } from '../types';

dotenv.config();
const router = express.Router();
router.use(bodyParser.json());
router.use(express.json());
// Enable cross-origin access control (CORS)
router.use(bodyParser.urlencoded({ extended: false }));
router.use(cookieParser());
router.use(cors({
     origin: true,
     credentials: true
}))


//ROUTER HANDLERS HERE 
const prisma = new PrismaClient();
const upload = multer({ dest: 'uploads/' });


router.post('/newdata', async (req, res) => {
   const { title, text, userid, tags, imageData } = await req.body;     

   const parsedImagedata = JSON.parse(imageData);
   const parsedTags = JSON.parse(tags);
   // Process imageData array
   parsedImagedata.forEach(async (image: imageDataType) => {
    const url = image.url;
    const thumb = image.thumb;

    // Process each image URL and thumbnail such storing it in the database 
    console.log('Image URL:', url);
    console.log('Thumbnail URL:', thumb);

    const data = await prisma.images.create({
         data: {
             url: url,
             thumb: thumb
         }
    }).then((res) => {
         console.log(res)
    }).catch((err) => {
         console.log(err)
    })
  });


   await prisma.notes.create({
     data: {
         text: text,
         title: title,
         userId: userid,
         Tags: {
            create: {
                tagNames: parsedTags
            }
         }
     }
   })
})
 



