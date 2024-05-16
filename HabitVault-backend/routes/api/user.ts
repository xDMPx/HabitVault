import { Router, Response } from 'express'
import { PrismaClient } from '@prisma/client'

import { restrict } from '../../middlewares'
import { TypedRequest } from '../../interfaces'

const router = Router()
const prisma = new PrismaClient()

router.get('/records', restrict, async (req: TypedRequest<any, any, { from: string, to: string }>, res: Response) => {

    const from = new Date(req.query.from)
    const to = new Date(req.query.to)

    const userid = req.session.username
    if (!isNaN(from.getTime()) && !isNaN(to.getTime())) {
        const user = await prisma.user.findFirst({
            where: { username: userid },
            include: {
                records: {
                    where: {
                        date: {
                            gte: from,
                            lte: to,
                        }
                    }
                }
            }
        })

        res.json(user?.records)
    } else {
        const user = await prisma.user.findFirst({
            where: { username: userid },
            include: { records: true }
        })

        res.json(user?.records)
    }
})

module.exports = router
