import { Router, Request, Response } from 'express'
import * as core from "express-serve-static-core"
import { PrismaClient } from '@prisma/client'

import { restrict } from '../middlewares'

const router = Router()
const prisma = new PrismaClient()

interface TypedRequest<B, P extends core.ParamsDictionary = core.ParamsDictionary> extends Request {
    body: B
    params: P
}

interface RegisterBody {
    username: string | undefined,
    password: string | undefined
}

interface LoginBody {
    username: string | undefined,
    password: string | undefined
}

router.get('/users', restrict, async (_req: Request, res: Response) => {
    const users = await prisma.user.findMany()
    res.json(users)
})

router.get('/authorized', restrict, async (_req: Request, res: Response) => {
    res.json()
})

//TODO: data validation, check if username already taken
router.post('/register', async (req: TypedRequest<RegisterBody>, res: Response) => {
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

router.post('/login', async (req: TypedRequest<LoginBody>, res: Response) => {
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
router.post('/signout', restrict, async (req: Request, res: Response) => {
    req.session.destroy((_err) => {
        res.json()
    })
})

module.exports = router