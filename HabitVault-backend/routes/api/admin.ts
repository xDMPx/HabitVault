import { Router, Request, Response } from 'express'
import { PrismaClient } from '@prisma/client'

import { adminRestrict } from '../../middlewares'
import { Session, TypedRequest } from '../../interfaces'
import { redisStore } from '../../app'
import { isValidUserName, stringToBoolean } from '../../utils'

const router = Router()
const prisma = new PrismaClient()

router.get('/users', adminRestrict, async (_req: Request, res: Response) => {
    const users = await prisma.user.findMany({
        select: {
            username: true,
            admin: true
        }
    })
    res.json(users)
})

router.delete('/user/:username', adminRestrict, async (req: TypedRequest<any, { username: string }>, res: Response) => {
    const username = req.params.username

    if (!isValidUserName(username)) {
        res.status(400).json({
            error: "Invalid Username"
        })
        return
    }

    if (username !== undefined) {
        const user = await prisma.user.delete({
            where: { username: username },
        })
        redisStore.all((_err: unknown, data: Session[]) => {
            data.filter((session) => session.username === username)
                .forEach((session) => redisStore.destroy(session.id))
        })

        res.json(user)
    } else {
        res.status(400).json()
    }
})

router.patch('/user/:username/admin', adminRestrict, async (req: TypedRequest<{ admin: string | boolean | undefined }, { username: string }>, res: Response) => {
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

    if (username !== undefined) {
        const user = await prisma.user.update({
            where: { username: username },
            data: { admin: admin }
        })
        res.json(user.admin)
    } else {
        res.status(400).json()
    }
})

module.exports = router
