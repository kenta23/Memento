import express, { RequestHandler } from 'express';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import cors, { CorsOptions } from 'cors';
import cookieParser from 'cookie-parser'
import { PrismaClient } from '@prisma/client';
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

router.get('/archived', async (req: CustomRequest, res) => {
      try {
          const data = await prisma.notes.findMany({
               where: {
                  archived: true
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

router.get('/favorites', async(req, res) => {
     try {
         const data = await prisma.notes.findMany({
              where: {
                 favorite: true
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
router.get('/')



 
export default router;
 



