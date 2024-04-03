import express from 'express';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import cors, { CorsOptions } from 'cors';
import { createRouteHandler } from 'uploadthing/express';
import { uploadRouter } from './uploadthing';
import cookieParser from 'cookie-parser'
import { initEdgeStore } from '@edgestore/server';
import { createEdgeStoreExpressHandler } from '@edgestore/server/adapters/express';
import { PrismaClient } from '@prisma/client';
import { withAccelerate } from '@prisma/extension-accelerate';


const app = express();
const port = 3000;

dotenv.config();

app.use(bodyParser.json());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
/**
 * Edge Store uses cookies to store the context token.
 * We need to use the cookie parser middleware to parse the cookies.
 */
app.use(cookieParser());
const corsOptions: CorsOptions = {
    origin: true,
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

//app.use('/prisma', );

//uploadthing API
app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
})
