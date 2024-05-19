import { Router, Request, Response } from 'express'
import { PrismaClient } from '@prisma/client'

import { adminRestrict } from '../../middlewares'
import { Session, TypedRequest } from '../../interfaces'
import { redisStore } from '../../app'

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

module.exports = router
