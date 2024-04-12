import express, { Request, Response, NextFunction, RequestHandler} from 'express';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import cors, { CorsOptions } from 'cors';
import { initEdgeStore } from '@edgestore/server';
import { createEdgeStoreExpressHandler } from '@edgestore/server/adapters/express';
import { PrismaClient } from '@prisma/client';
import router from './routes/handler'; 
import cookieParser from 'cookie-parser';
import multer from 'multer';


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
    origin: '*',
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

app.use('/api', router);

app.get('/', (req, res) => {
    res.send('Hello World!');
})
app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
})
 