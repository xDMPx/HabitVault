import express, { NextFunction, Request, Response } from 'express'
import * as core from "express-serve-static-core"
import session from 'express-session'
import cors from 'cors'
import { PrismaClient } from '@prisma/client'
import dotenv from "dotenv"

dotenv.config()
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
const port = process.env.PORT || 3000

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

interface TypedRequest<B, P extends core.ParamsDictionary = core.ParamsDictionary> extends Request {
    body: B
    params: P
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
            req.session.regenerate(() => {
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

interface HabitBody {
    name: string | undefined,
    description: string | undefined
}

app.get('/user/habits', restrict, async (req: Request, res: Response) => {
    const userid = req.session.userid
    const user_habits = await prisma.user.findFirst({
        where: { id: userid },
        include: { habits: true }
    })
    res.json(user_habits?.habits)
})

//TODO: data validation, check if habit already exists 
app.post('/user/habits', restrict, async (req: TypedRequest<HabitBody>, res: Response) => {
    const userid = req.session.userid
    const name = req.body.name
    const description = req.body.description
    if (name !== undefined && description !== undefined) {
        const habit = await prisma.habit.create({
            data: {
                name: name,
                description: description,
                userId: userid
            }
        })
        res.json(habit)
    }
    res.status(400).json()
})

//TODO: data validation, check if it's user's habit
app.put('/user/habits/:id', restrict, async (req: TypedRequest<HabitBody, { id: string }>, res: Response) => {
    const userid = req.session.userid
    const habitid: number = +req.params.id
    const name = req.body.name
    const description = req.body.description
    if (name !== undefined && description !== undefined && !isNaN(habitid)) {
        const habit = await prisma.habit.update({
            where: { id: habitid },
            data: {
                name: name,
                description: description,
                userId: userid
            }
        })
        res.json(habit)
    }
    res.status(400).json()
})

//TODO: data validation, check if it's user's habit
app.delete('/user/habits/:id', restrict, async (req: TypedRequest<HabitBody, { id: string }>, res: Response) => {
    const habitid: number = +req.params.id
    if (!isNaN(habitid)) {
        const habit = await prisma.habit.delete({
            where: { id: habitid },
        })
        res.json(habit)
    }
    res.status(400).json()
})

app.listen(port, () => {
    console.log(`HabitVault backend listening on port ${port}`)
})

