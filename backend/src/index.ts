import express, { Request, Response, NextFunction, RequestHandler} from 'express';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import cors, { CorsOptions } from 'cors';
import { initEdgeStore } from '@edgestore/server';
import { createEdgeStoreExpressHandler } from '@edgestore/server/adapters/express';
import { PrismaClient } from '@prisma/client';
import router from './routes/handler'; 
import { imageDataType } from './types';
import cookieParser from 'cookie-parser';
import multer from 'multer';
import clerkclient from '@clerk/clerk-sdk-node';


export interface CustomRequest extends Request {
    userId?: string;
}
const app = express();
const port = 3000;
const upload = multer();


dotenv.config();

app.use(bodyParser.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: false }));
/**
 * Edge Store uses cookies to store the context token.
 * We need to use the cookie parser middleware to parse the cookies.
 */
const corsOptions: CorsOptions = {
    origin: 'http://localhost:5173',
    credentials: true,
}
app.use(cors(corsOptions));
//EDGESTORE ROUTER CONFIG 
const es = initEdgeStore.create();
const edgeStoreRouter = es.router({
    publicFiles: es.imageBucket()
});

export type EdgeStoreRouter = typeof edgeStoreRouter;

const prisma = new PrismaClient();

const handler = createEdgeStoreExpressHandler({
     router: edgeStoreRouter
})

const middlewareUser: RequestHandler<{}, {}, any, any, {}> = async (req: CustomRequest, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
  
    if (!token) return res.status(401).json({ message: "Invalid token" });
  
    req.userId = token; // Assign value to userId property
    next();
};
//EXPRESS ROUTES 
app.get('/edgestore/*', handler);
app.post('/edgestore/*', handler);


app.get('/users', async (req, res) => {
    const data = await prisma.notes.findFirst({
        where: {
            id: 1
        }
    });
    res.status(200).json(data);
})

app.use('/note', router);



/*app.get('/getdata', middlewareUser, async (req: CustomRequest, res) => {
    try {
        const userId = req.userId;

        const data = await prisma.notes.findMany({
            where: { userId: userId },
            include: { Tags: true, Images: true}
        })

        res.status(200).json(data);

    } catch (error) {
        console.log(error)
    } 
    
}) */


app.use('/api', router);

app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
})
 