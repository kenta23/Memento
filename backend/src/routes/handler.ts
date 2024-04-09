import express, { RequestHandler } from 'express';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import cors, { CorsOptions } from 'cors';
import cookieParser from 'cookie-parser'
import { Prisma, PrismaClient } from '@prisma/client';
import multer from 'multer';
import { imageDataType } from '../types';
import { CustomRequest } from '..';

dotenv.config();

const router = express.Router();
router.use(bodyParser.json());
// Enable cross-origin access control (CORS)
router.use(bodyParser.urlencoded({ extended: false }));
router.use(cookieParser());
router.use(cors({
     origin: true,
     credentials: true
}))

//ROUTER HANDLERS HERE 
const prisma = new PrismaClient();
const upload = multer();

const middlewareUser: RequestHandler<{}, {}, any, any, {}> = async (req: CustomRequest, res, next) => {
     const authHeader = req.headers['authorization'];
     const token = authHeader && authHeader.split(' ')[1];
   
     if (!token) return res.status(401).json({ message: "Invalid token" });
   
     req.userId = token; // Assign value to userId property
     next();
 };

router.use(middlewareUser);

router.get('/getdata', async (req: CustomRequest, res) => {
     try {
         const userId = req.userId;
 
         const data = await prisma.notes.findMany({
             where: { userId: userId },
             include: { Tags: true, Images: true}
         })
 
         res.status(200).json(data);
 
     } catch (error) {
         res.status(404).json({ error: error });
     } 
     
 })
 router.get('/note/:id', async (req: CustomRequest, res) => {
     const { id } = req.params;
     console.log('params', id)

    try {
     const data = await prisma.notes.findFirstOrThrow({
          where: { id: Number(id) },
          include: {
               Images: true,
               Tags: true,
          }
      })
      res.status(200).json(data);
    } catch (error) {
       res.status(404).json({ error: error });
    }
 })

router.get('/archive', async (req: CustomRequest, res) => {
     const userid = req.userId;
      try {
          const data = await prisma.notes.findMany({
               where: {
                  archived: true,
                  userId: userid, 
               },   
               include: {
                     Images: true,
                     Tags: true,
               }
          })
          res.status(200).json(data);
      } catch (error) {
          res.status(404).json({ error: error });
      }
})

router.get('/favorites', async(req: CustomRequest, res) => {
     try {
         const data = await prisma.notes.findMany({
              where: {
                 favorite: true,
                 userId: req.userId
              },   
              include: {
                    Images: true,
                    Tags: true,
              }
         })
         res.status(200).json(data);
     } catch (error) {
         res.status(404).json({ error: error });
     }
})

router.get('/ascending', async (req, res) => {
     try {
         const data = await prisma.notes.findMany({
              orderBy: {
                   createdAt: 'asc'
              },
              include: {
                    Images: true,
                    Tags: true,
              }
         })
         res.status(200).json(data);
     } catch (error) {
         res.status(404).json({ error: error });
     }
})

//update data 
router.post('/updatedata', async (req, res) => {
  const { title, tags, note, id, imageData } = req.body;

  // Check if 'id' exists in the req.body object before proceeding
  if (!id) {
    return res
      .status(400)
      .json({ error: "Note id is missing in the request body" });
  }

  const updatedData = await prisma.notes.update({
    where: {
      id: Number(id),
    },
    data: {
      title: title ?? "",
      text: note ?? "",
    },
  });

  if (tags) {
    const parsedTags = JSON.parse(tags);

    await prisma.tags.update({
      where: {
        id: updatedData.id,
      },
      data: {
        tagNames: {
          set: parsedTags,
        },
      },
    });
  }

  if (imageData !== undefined) {
    try {
      // Iterate over the imageData array
      for (const imageArray of imageData) {
        if (Array.isArray(imageArray)) {
          for (const imageString of imageArray) {
            const { url, thumb } = JSON.parse(imageString);
            const newImage = await prisma.images.create({
              data: {
                url,
                thumbnail: thumb,
                noteId: updatedData.id,
              },
            });
            console.log("NEW IMAGE", newImage);
          }
        } else {
          // If it's not an array, parse the JSON string directly
          const { url, thumb } = JSON.parse(imageArray);
          await prisma.images.create({
            data: {
              url,
              thumbnail: thumb,
              noteId: updatedData.id,
            },
          });
        }
      }
    } catch (error) {
      console.error("Error uploading images:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }

  res.status(200).json(updatedData);
})
router.get('/')



 
export default router;
 



