import express, { NextFunction, Request, Response } from 'express'
import cookieParser from 'cookie-parser'
import Redis from "ioredis"
import cors from 'cors'
import dotenv from "dotenv"

import { log } from './middlewares'

dotenv.config()
export const jwtSecret = process.env.JWT_SECRET ?? ""
if (jwtSecret === "") {
    throw "Define JWT_SECRET in .env"
}

export const redis = new Redis()
const app = express()
app.use(express.json())
app.use(cookieParser())
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true,
}))
app.use(log)

app.use('/api/', require('./routes/api'))
app.use('/api/admin', require('./routes/api/admin'))
app.use('/api/user', require('./routes/api/user'))
app.use('/api/user/habits', require('./routes/api/user/habits'))
app.use((_req: Request, res: Response, _next: NextFunction) => {
    res.destroy()
})

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    console.error(`${req.ip} ${req.method} ${req.url} => ERROR\n${err}`)
    if (res.headersSent) {
        return next(err)
    }
    res.status(500).json({ error: "INTERNAL SERVER ERROR" })
});

const port = process.env.PORT || 3000
app.listen(port, () => {
    console.log(`HabitVault backend listening on port ${port}`)
})

