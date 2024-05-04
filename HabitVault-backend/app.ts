import express from 'express'
import session from 'express-session'
import cors from 'cors'
import dotenv from "dotenv"

import { log } from './middlewares'

dotenv.config()

const app = express()
app.use(express.json())
app.use(session({
    resave: false, // don't save session if unmodified
    saveUninitialized: false, // don't create session until something stored
    secret: 'testSecret',
    name: "session",
    cookie: {
        maxAge: 600000,
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
app.use('/api/user', require('./routes/api/user'))
app.use('/api/user/habits', require('./routes/api/user/habits'))

const port = process.env.PORT || 3000
app.listen(port, () => {
    console.log(`HabitVault backend listening on port ${port}`)
})

