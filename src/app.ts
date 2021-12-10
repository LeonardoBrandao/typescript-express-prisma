import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'
import cors from 'cors';
import dotenv from 'dotenv'
import express from 'express'
import { jwtMiddleware } from './middleware/jwtAuth';
import morgan from 'morgan'
import router from './router';

// setting environment variables
dotenv.config()

const app = express();

// middlewares are called in the order they are defined below
app.use(bodyParser.json());
app.use(morgan('combined'))
app.use(cors({ origin: "*" }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser())
app.use(jwtMiddleware({ publicUrls: ["/healthcheck", "/login"] }))

app.use(router)

export default app