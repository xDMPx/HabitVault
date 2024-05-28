import express, { NextFunction, Request, Response } from 'express'
import session from 'express-session'
import RedisStore from "connect-redis"
import Redis from "ioredis"
import cors from 'cors'
import dotenv from "dotenv"

import { log } from './middlewares'

dotenv.config()

const redis = new Redis()
export const redisStore = new RedisStore({
    client: redis,
})
const app = express()
app.use(express.json())
app.use(session({
    store: redisStore,
    resave: false, // required: force lightweight session keep alive (touch)
    saveUninitialized: false, // recommended: only save session when data exists
    secret: 'testSecret',
    name: "session",
    cookie: {
        maxAge: 31536000000,
        secure: false,
        sameSite: 'lax'
    }
}))

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

const port = process.env.PORT || 3000
app.listen(port, () => {
    console.log(`HabitVault backend listening on port ${port}`)
})

