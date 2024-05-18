import { Router, Request, Response } from 'express'
import { PrismaClient } from '@prisma/client'

import { restrict, adminRestrict } from '../middlewares'
import { TypedRequest, RegisterBody, LoginBody } from '../interfaces'

const router = Router()
const prisma = new PrismaClient()

router.get('/authorized', restrict, async (_req: Request, res: Response) => {
    res.json()
})

router.get('/adminAuthorized', adminRestrict, async (_req: Request, res: Response) => {
    res.json()
})

router.post('/register', async (req: TypedRequest<RegisterBody>, res: Response) => {
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

    const user = await prisma.user.create({
        data: {
            username: username,
            password: password
        }
    })
    res.json(user)

})

function isValidUserName(username: string): Boolean {
    const usernameRegex = /^[a-zA-Z][a-zA-Z0-9._-]{3,29}$/
    return usernameRegex.test(username)
}

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
                req.session.username = user.username
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
