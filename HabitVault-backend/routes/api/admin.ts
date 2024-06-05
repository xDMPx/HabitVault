import { Router, Request, Response, NextFunction } from 'express'
import { PrismaClient } from '@prisma/client'

import { adminRestrict } from '../../middlewares'
import { TypedRequest } from '../../interfaces'
import { redis } from '../../app'
import { isValidUserName, stringToBoolean } from '../../utils'

const router = Router()
const prisma = new PrismaClient()

router.get('/users', adminRestrict, async (_req: Request, res: Response, next: NextFunction) => {
    try {
        const users = await prisma.user.findMany({
            select: {
                username: true,
                admin: true
            }
        })

        const users2: { username: string, admin: boolean, banned: boolean }[] = []
        for (const user of users) {
            users2.push({
                username: user.username,
                admin: user.admin,
                banned: (await redis.get(`banned:${user.username}`) === "1")
            })
        }

        res.json(users2)
    } catch (err) {
        next(err)
    }
})

router.delete('/user/:username', adminRestrict, async (req: TypedRequest<any, { username: string }>, res: Response, next: NextFunction) => {
    try {
        const username = req.params.username

        if (!isValidUserName(username)) {
            res.status(400).json({
                error: "Invalid Username"
            })
            return
        }

        const user = await prisma.user.findFirst({
            where: { username: username },
        })
        if (user?.admin) {
            const admin_count = await prisma.user.count({
                where: { admin: true }
            })
            if (admin_count - 1 <= 0) {
                res.status(400).json({
                    error: "At least one admin account must exist."
                })
                return
            }
        }

        if (username !== undefined) {
            await redis.set(`banned:${username}`, 1)

            const user = await prisma.user.delete({
                where: { username: username },
            })
            res.json(user)
        } else {
            res.status(400).json()
        }
    } catch (err) {
        next(err)
    }
})

router.post('/user/:username/ban', adminRestrict, async (req: TypedRequest<any, { username: string }>, res: Response, next: NextFunction) => {
    try {
        const username = req.params.username

        if (!isValidUserName(username)) {
            res.status(400).json({
                error: "Invalid Username"
            })
            return
        }
        const admin = await prisma.user.count({
            where: { admin: true, username: username }
        }) !== 0
        const admin_count = await prisma.user.count({
            where: { admin: true }
        })
        if (admin_count - 1 <= 0 && admin === true) {
            res.status(400).json({
                error: "At least one admin account must exist. Cannot ban last admin."
            })
            return
        }

        const user = await prisma.user.findFirst({
            where: { username: username },
        })
        if (user !== null) {
            if (username !== undefined) {
                await redis.set(`banned:${username}`, 1)

                res.json(user)
            } else {
                res.status(400).json()
            }
        }
    } catch (err) {
        next(err)
    }
})

router.patch('/user/:username/admin', adminRestrict, async (req:
    TypedRequest<{ admin: string | boolean | undefined }, { username: string }>, res: Response, next: NextFunction) => {
    try {
        const username = req.params.username
        let admin = undefined
        if (typeof (req.body.admin) === 'boolean') {
            admin = req.body.admin
        } else {
            admin = stringToBoolean(req.body.admin)
        }

        if (!isValidUserName(username)) {
            res.status(400).json({
                error: "Invalid Username"
            })
            return
        }
        if (admin === undefined) {
            res.status(400).json({ error: "Invalid admin status" })
            return
        }

        const admin_count = await prisma.user.count({
            where: { admin: true }
        })
        if (admin_count - 1 <= 0 && admin === false) {
            res.status(400).json({
                error: "At least one admin account must exist. Cannot remove admin status from the last remaining admin."
            })
        }
        else if (username !== undefined) {
            const user = await prisma.user.update({
                where: { username: username },
                data: { admin: admin }
            })
            res.json(user.admin)
        } else {
            res.status(400).json()
        }
    } catch (err) {
        next(err)
    }
})

module.exports = router
