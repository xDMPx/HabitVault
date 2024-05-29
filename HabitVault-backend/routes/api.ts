import { Router, Request, Response, NextFunction } from 'express'
import { PrismaClient } from '@prisma/client'
import * as argon2 from "argon2"

import { restrict, adminRestrict } from '../middlewares'
import { TypedRequest, RegisterBody, LoginBody } from '../interfaces'
import { isValidUserName } from '../utils'

const router = Router()
const prisma = new PrismaClient()


router.get('/authorized', restrict, async (_req: Request, res: Response) => {
    res.json()
})

router.get('/adminAuthorized', adminRestrict, async (_req: Request, res: Response) => {
    res.json()
})

router.post('/register', async (req: TypedRequest<RegisterBody>, res: Response, next: NextFunction) => {
    try {
        const username = req.body.username
        const password = req.body.password
        const user_count = await prisma.user.count({
            where: {
                username: username
            }
        })

        if (username === undefined) {
            res.status(400).json({
                error: "Username not provided"
            })
            return
        }
        else if (password === undefined) {
            res.status(400).json({
                error: "Password not provided"
            })
            return
        }
        else if (user_count !== 0) {
            res.status(400).json({
                error: "Username already taken"
            })
            return
        }
        else if (!isValidUserName(username)) {
            res.status(400).json({
                error: "Invalid Username"
            })
            return
        }

        const passhash = await argon2.hash(password)
        const user = await prisma.user.create({
            data: {
                username: username,
                password: passhash
            }
        })

        res.json(user)
    } catch (err) {
        next(err)
    }
})


router.post('/login', async (req: TypedRequest<LoginBody>, res: Response, next: NextFunction) => {
    try {
        const username = req.body.username
        const password = req.body.password
        if (username !== undefined && isValidUserName(username) && password !== undefined) {
            const user = await prisma.user.findFirst({
                where: {
                    username: username,
                },
                select: {
                    username: true,
                    password: true
                }
            })
            if (user?.password !== undefined) {
                const result = await argon2.verify(user?.password, password)
                if (result) {
                    req.session.regenerate((err) => {
                        if (err !== undefined) {
                            next(err)
                        } else {
                            req.session.username = user.username
                            res.json()
                        }
                    })
                } else {
                    res.status(400).json()
                }
            } else {
                res.status(400).json()
            }
        } else {
            res.status(400).json()
        }
    } catch (err) {
        next(err)
    }
})

router.post('/signout', restrict, (req: Request, res: Response, next: NextFunction) => {
    req.session.destroy((err) => {
        if (err === undefined) {
            res.json()
        } else {
            next(err)
        }
    })
})

module.exports = router
