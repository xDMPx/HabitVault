import express, { NextFunction, Request, Response } from 'express'
import session from 'express-session'
import cors from 'cors'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()
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
const port = 3000

app.use((req: Request, _res: Response, next: NextFunction) => {
    console.log(`${req.ip} ${req.method} ${req.url} => ${JSON.stringify(req.body)}`)
    next()
})

app.get('/users', restrict, async (_req: Request, res: Response) => {
    const users = await prisma.user.findMany()
    res.json(users)
})

app.get('/authorized', restrict, async (_req: Request, res: Response) => {
    res.json()
})

interface RegisterBody {
    username: string | undefined,
    password: string | undefined
}

interface TypedRequest<T> extends Request {
    body: T
}

//TODO: data validation, check if username already taken
app.post('/register', async (req: TypedRequest<RegisterBody>, res: Response) => {
    const username = req.body.username
    const password = req.body.password
    if (username !== undefined && password !== undefined) {
        const user = await prisma.user.create({
            data: {
                username: username,
                password: password

            }
        })
        res.json(user)
    } else {
        res.status(400).json()
    }
})

declare module 'express-session' {
    interface SessionData {
        userid: number | undefined
    }
}

interface LoginBody {
    username: string | undefined,
    password: string | undefined
}

app.post('/login', async (req: TypedRequest<LoginBody>, res: Response) => {
    const username = req.body.username
    const password = req.body.password
    if (username !== undefined && password !== undefined) {
        const user = await prisma.user.findFirst({
            where: {
                username: username,
            }
        })
        if (user?.password === password) {
            req.session.regenerate(function () {
                req.session.userid = user.id
                res.json()
            });
        }
        else {
            res.status(401).json()
        }
    } else {
        res.status(400).json()
    }

})

//TODO Handle error
app.post('/signout', restrict, async (req: Request, res: Response) => {
    req.session.destroy((_err) => {
        res.json()
    })
})

function restrict(req: Request, res: Response, next: NextFunction) {
    if (req.session.userid !== undefined) {
        next()
    } else {
        res.status(401).json()
    }
}

app.listen(port, () => {
    console.log(`HabitVault backend listening on port ${port}`)
})
